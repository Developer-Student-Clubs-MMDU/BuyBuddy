import React from 'react';
import { Box, VStack, Image, Text, Heading, SimpleGrid, Button, Flex, Grid, Link } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductChart = ({ data }) => {
  // Prepare the data for the chart
  const labels = data.title;
  const prices = data.map(item => item.price);
  const ratings = data.map(item => item.rating);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Price',
        data: prices,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Rating',
        data: ratings,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Comparison',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

function RecommendedVideoCard({ video }) {
  return (
    <Flex alignItems="center" p={2} borderWidth="1px" borderRadius="md">
      <Image src={video.thumbnail} alt={video.title} width="120px" height="68px" objectFit="cover" mr={3} />
      <Text fontSize="sm" fontWeight="medium">{video.title}</Text>
    </Flex>
  );
}

function DetailsPage() {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <Text>No product data found.</Text>;
  }

  // Function to format the specifications
  const formatSpecifications = () => {
    const specs = [];
    if (product.price) specs.push(`Price: ${product.price}`);
    if (product.processor) specs.push(`Display: ${product.Display}`);
    if (product.RAM) specs.push(`Camera: ${product.Camera}`);
    if (product.SSD) specs.push(`Battery: ${product.Battery}`);
    // Add other specifications similarly
    return specs.map((spec, index) => (
      <Text key={index} mb={2}>{spec}</Text>
    ));
  };

  return (
    <VStack spacing={8} align="stretch">
      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        <Image src={product.image_url} alt={product.title} objectFit="cover" />
        <ProductChart data={product} />
        <Box>
          <Heading as="h1" size="2xl" mb={4}>{product.title}</Heading>
          <Box mb={4}>
            <Heading as="h2" size="lg" mb={2}>Specifications:</Heading>
            {formatSpecifications()} {/* Display formatted specifications */}
          </Box>
          <Heading as="h2" size="lg" mb={2}>Youtube Details:</Heading>
          <Text mb={4} className="ellipsis">Review: {product.transcript}</Text>
          <Text fontWeight="bold">YouTube Links:</Text>
          <VStack align="start" spacing={2}>
            {Object.entries(product.youtube_videos).map(([key, link], index) => (
              <Link key={index} href={link} isExternal color="teal.500">
                {`YouTube Video ${index + 1}`}
              </Link>
            ))}
          </VStack>
          {/* <Text fontWeight="bold" mb={2}>Recommended Videos:</Text> */}
          {/* <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4} mb={4}>
            {product.recommendedVideos.map((video) => (
              <RecommendedVideoCard key={video.id} video={video} />
            ))}
          </Grid>
          <Flex gap={2}>
            <Button colorScheme="teal" onClick={() => window.open(product.youtubeLink, '_blank')}>Youtube</Button>
            <Button colorScheme="teal" onClick={() => window.open(product.websiteLink, '_blank')}>Website</Button>
          </Flex> */}
        </Box>
      </SimpleGrid>
    </VStack>
  );
}

export default DetailsPage;
