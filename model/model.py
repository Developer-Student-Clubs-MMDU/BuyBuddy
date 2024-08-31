# prompt: Install dependencies which are needed in next cell

# !pip install -q langchain_openai
# !pip install -q pandas
# !pip install -q langchain_experimental
# !pip install langchain
# !pip install boto3
# !pip install -U langchain-aws
# !pip install -U langchain_community
from langchain_community.chat_models import BedrockChat
from flask import Flask, request, jsonify
from flask_cors import CORS
# !pip install tiktoken
# !pip install openai
# !pip install langchain_openai
# !pip install langchain_community
# !pip install lancedb
# !pip install python-dotenv
# !pip install streamlit
# !pip install langchain_google_genai
# !pip install langchain_experimental
# !pip install ChatGoogleGenerativeAI
# !pip install google-generativeai

from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from dotenv import load_dotenv
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain_google_genai import ChatGoogleGenerativeAI
import json
import os
import streamlit as st
import pandas as pd
from fuzzywuzzy import fuzz

app = Flask(__name__)
CORS(app)

API_KEY = 'AIzaSyCAOLlxMduytj_KCXJMVEoBOprIHWW4DdY'
def handle_nan(value):
    """Convert NaN values to string 'NaN'."""
    return 'NaN' if pd.isna(value) else value

@app.route('/api/data', methods=['POST'])
def get_data():
    input_data = request.json
    query = input_data.get('query')
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
    os.environ["API_KEY"] = "AIzaSyCAOLlxMduytj_KCXJMVEoBOprIHWW4DdY"
    data = pd.read_excel("All_smartphone_product.xlsx")
    youtube_file = "updated_excel_file.xlsx"
    df_youtube = pd.read_excel(youtube_file)

    data['price'] = pd.to_numeric(data['price'], errors='coerce')
    data['rating'] = pd.to_numeric(data['rating'], errors='coerce')
    data['youtube_review'] = pd.to_numeric(data['youtube_review'], errors='coerce')
    llm = ChatGoogleGenerativeAI(model="gemini-pro",google_api_key=API_KEY)
    if data is not None:
      try:
        agent = create_pandas_dataframe_agent(llm, data, verbose=True, allow_dangerous_code=True, handle_parsing_errors=True)
        for _ in range(2):
          response = agent.run(query + "based on best possible ratings and youtube review available in 'rating' and 'youtube_review' column. Return only Product ID given in 'Id' column.")    
        cleaned_str = json.dumps(response, indent=2).strip("[]\"'")
        # Step 3: Replace escaped quotes and brackets
        cleaned_str = cleaned_str.replace("\\'", "'").replace('\\", "', '')
        # Step 4: Convert the string back to a list
        value_list = [value.strip() for value in cleaned_str.split(',')]
        # Step 5: Remove quotes around the values
        value_list = [value.strip("'\"") for value in value_list]

        print("value list", value_list)
        # Create an empty list to store the IDs that should be kept
        unique_ids = []
        df_filtered = data[data['Id'].isin(value_list)]

        for i in df_filtered.index:
          current_id = df_filtered.loc[i, 'Id']
          current_title = df_filtered.loc[i, 'title']
          
          # Check if the current title is similar to any already kept titles
          is_unique = True
          for unique_id in unique_ids:
              unique_title = data[data['Id'] == unique_id]['title'].values[0]
              if 50 <= fuzz.ratio(current_title, unique_title):  # Adjust similarity range as needed
                  is_unique = False
                  break
          
          # If the title is unique or not within the similarity range, add the ID to the list
          if is_unique:
              unique_ids.append(current_id)

          # Display the filtered DataFrame
        unique_ids_json = df_filtered[df_filtered['Id'].isin(unique_ids)].set_index('Id').applymap(handle_nan).to_dict(orient='index')
        df_youtube_copy = df_youtube.copy()
        df_youtube_copy = df_youtube_copy.drop_duplicates(subset='title')
        title_to_youtube = df_youtube_copy.set_index('title')[['link1', 'link2', 'link3']].applymap(handle_nan).to_dict(orient='index')

        # Update the JSON structure with YouTube videos
        for id, details in unique_ids_json.items():
            cleaned_title = details['title'].split('(')[0].strip()
            if cleaned_title in title_to_youtube:
                details['youtube_videos'] = title_to_youtube[cleaned_title]
                index = df_youtube_copy[df_youtube_copy['title'] == cleaned_title].index[0]
                # Select the transcript for that index
                details['transcript'] = df_youtube_copy.loc[index, 'youtube_transcripts']

        unique_ids_json_str = json.dumps(unique_ids_json, indent=4)
        print(unique_ids_json_str)
        return unique_ids_json_str, 200, {'Content-Type': 'application/json'}
      except Exception as e:
        return jsonify({"error": "Failed to fectch results. Try back in sometime.", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)