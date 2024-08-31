import pandas as pd
from urllib.parse import urlparse
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from textblob import TextBlob
from langdetect import detect, LangDetectException
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

import nltk
nltk.download('punkt')

def summarize_transcript(transcript, num_sentences=5, language='english'):
    """
    Summarizes the given transcript text using LSA summarizer.

    Parameters:
    - transcript (str): The transcript text to be summarized.
    - num_sentences (int): The number of sentences to include in the summary.
    - language (str): The language of the transcript.

    Returns:
    - summary (str): The summarized text.
    """
    parser = PlaintextParser.from_string(transcript, Tokenizer(language))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, num_sentences)
    summary_text = ' '.join([str(sentence) for sentence in summary])
    return summary_text

def get_video_id(url):
    """Extracts the video ID from a YouTube URL."""
    parsed_url = urlparse(url)
    query = parsed_url.query
    if "v" in query:
        return query.split("v=")[1]
    else:
        return None

def analyze_reviews(video_id, language='english'):
    """Analyzes the sentiment of reviews in a YouTube video transcript."""
    try:
        transcript_data = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
    except TranscriptsDisabled:
        print(f"Transcripts are disabled for video ID {video_id}.")
        return None, None

    transcript = " ".join([item['text'] for item in transcript_data])
    
    summary = summarize_transcript(transcript, num_sentences=4, language=language)

    reviews = [segment["text"] for segment in transcript_data if "review" in segment["text"].lower()]
    sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
    for review in reviews:
        analysis = TextBlob(review)
        if analysis.sentiment.polarity > 0.1:
            sentiment_counts["positive"] += 1
        elif analysis.sentiment.polarity < -0.1:
            sentiment_counts["negative"] += 1
        else:
            sentiment_counts["neutral"] += 1
    return sentiment_counts, summary

def detect_language(text):
    """Detects the language of the provided text."""
    try:
        return detect(text)
    except LangDetectException:
        return 'en'  # Default to English if detection fails

# Load the Excel file
df = pd.read_excel('All_smartphones_youtube_final.xlsx')

# Create lists to store the results
summarized_transcripts = []
sentiment_analysis_results = []

# Iterate over each row in the DataFrame
for index, row in df.iterrows():
    links = [row['link1'], row['link2'], row['link3']]
    
    full_transcript = ""
    all_sentiments = {"positive": 0, "negative": 0, "neutral": 0}
    
    for link in links:
        if pd.notna(link):
            video_id = get_video_id(link)
            if video_id:
                try:
                    # Retrieve a brief part of the transcript to detect the language
                    transcript_data = YouTubeTranscriptApi.get_transcript(video_id)
                    first_text = " ".join([item['text'] for item in transcript_data[:3]])
                    language = detect_language(first_text)
                    
                    # Analyze and summarize the transcript in the detected language
                    sentiment_counts, summary = analyze_reviews(video_id, language=language)
                    if summary:
                        full_transcript += summary + " "
                    
                    for sentiment in sentiment_counts:
                        all_sentiments[sentiment] += sentiment_counts[sentiment]
                except Exception as e:
                    print(f"Could not process {link}: {e}")
                    continue
    
    summarized_transcripts.append(full_transcript.strip())
    sentiment_analysis_results.append(all_sentiments)

# Add the results as new columns to the DataFrame
df['youtube_transcripts'] = summarized_transcripts
df['sentiment_analysis'] = sentiment_analysis_results

# Save the updated DataFrame back to an Excel file
df.to_excel('updated_excel_file.xlsx', index=False)

print("YouTube transcripts summarized and sentiment analysis saved successfully.")