'use client';

import { useState, useEffect } from 'react';
import { Heart, Clock, Eye } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';

interface SubtopicResponse {
  title: string;
  description: string;
}

interface FunFact {
  title: string;
  description: string[];
}

interface TopicResponse {
  title: string;
  author: string;
  likes: number;
  views: number;
  timestamp: string;
  introduction: string;
  subtopics: SubtopicResponse[];
  fun_fact?: FunFact;
  images: string[];
  links?: string[];
}

const MOCK_CONTENT: Record<string, TopicResponse> = {
  'new-planet-9-discovery': {
    title: 'Breaking News: Possible Discovery of Planet 9',
    author: 'astroFan',
    likes: 45,
    views: 301,
    timestamp: '10 minutes ago',
    introduction:
      'Astronomers are abuzz with speculation about <strong>Planet 9</strong>, a potential ninth planet lurking in the outer reaches of our <strong>solar system</strong>. Recent studies suggest it could be significantly larger than Earth and follow an orbit around the Sun spanning tens of thousands of years.',
    subtopics: [
      {
        title: 'Evidence Supporting Planet 9',
        description:
          'Anomalies observed in the orbits of certain <strong>trans-Neptunian objects (TNOs)</strong> suggest the influence of a massive, unseen planet. These objects exhibit unusual alignments and orbital inclinations that cannot be explained by the gravitational effects of known planets. Computer simulations indicate that a planet approximately <strong>10 times the mass of Earth</strong>, located at an average distance of <strong>500 astronomical units (AU)</strong> from the Sun, could account for these observations.',
      },
      {
        title: "Astronomers' Search Methods",
        description:
          'To locate <strong>Planet 9</strong>, scientists are combining telescopic observations with sophisticated computer modeling. They analyze gravitational perturbations experienced by <strong>TNOs</strong> and search for visual clues in the vast expanses of the sky. The <strong>Vera C. Rubin Observatory</strong>, currently under construction in Chile, is expected to play a crucial role in this quest by providing high-resolution images of distant regions of the solar system.',
      },
    ],
    fun_fact: {
      title: 'Did You Know?',
      description: [
        'If it exists, <strong>Planet 9</strong> could have a mass about <strong>10 times that of Earth</strong> and an orbit so distant that each revolution around the Sun would take between <strong>10,000 and 20,000 years</strong>.',
      ],
    },
    images: [
      'https://i0.wp.com/www.laterredufutur.com/accueil/wp-content/uploads/2022/01/planete-9.jpg?fit=1187%2C774&ssl=1',
      'https://lejournal.cnrs.fr/sites/default/files/styles/asset_image_full/public/assets/images/p9_kbo_orbits_labeled-news-web_72dpi.jpg?itok=pchzfbed',
    ],
  },
  'python-ml-course': {
    title: "Mastering Machine Learning with Python",
    author: 'jperrama',
    likes: 85,
    views: 540,
    timestamp: '5 hours ago',
    introduction:
      "Embark on a comprehensive journey into the world of <strong>machine learning</strong> using <strong>Python</strong>. This course covers everything from the <strong>fundamentals</strong> of the language to <strong>advanced algorithms</strong>, tailored for both beginners and seasoned professionals.",
    subtopics: [
      {
        title: 'Introduction to Python Programming',
        description:
          "Begin your journey with an introduction to <strong>Python programming</strong>, exploring the language's history, philosophy, and key features that make it ideal for <strong>machine learning</strong>. Learn how to set up your development environment, write your first Python program, and understand basic programming concepts such as variables, data types, and control structures. This module also delves into the Python ecosystem, introducing you to essential tools and resources.",
      },
      {
        title: 'Python Foundations',
        description:
          "Deepen your understanding of <strong>Python</strong> by studying its <strong>syntax</strong>, working with <strong>data structures</strong> like lists, tuples, dictionaries, and sets, and writing functions and modules for code reusability. This module emphasizes object-oriented programming principles, exception handling, and best practices for writing clean, efficient Python code. Building a strong foundation in these concepts is vital for mastering <strong>machine learning techniques</strong> and will enable you to tackle complex coding challenges with confidence.",
      },
      {
        title: 'Probability and Statistics for Machine Learning',
        description:
          "Develop a solid grasp of the <strong>probability and statistics</strong> concepts that underpin machine learning algorithms. Cover fundamental topics such as probability distributions, statistical significance, hypothesis testing, Bayesian inference, and data sampling methods. Understand how statistical measures like mean, median, variance, and standard deviation are used in data analysis. This module bridges the gap between mathematical theory and practical application, ensuring you can interpret and utilize statistical information effectively in your machine learning projects.",
      },
      {
        title: 'Data Manipulation and Analysis with Pandas',
        description:
          "Master data manipulation and analysis using the <strong>Pandas</strong> library, a powerful tool for handling structured data. Learn how to read and write data in various formats such as CSV, Excel, and SQL databases. Explore data cleaning techniques to handle missing or inconsistent data, and perform operations like filtering, sorting, grouping, and aggregating data. This module also covers time series analysis and introduces you to advanced indexing and selection methods, enabling you to prepare datasets efficiently for machine learning tasks.",
      },
      {
        title: 'Data Visualization with Matplotlib and Seaborn',
        description:
          "Discover how to visualize data effectively using <strong>Matplotlib</strong> and <strong>Seaborn</strong>. Learn to create a wide array of plots and charts, including line graphs, bar charts, histograms, box plots, heatmaps, and pair plots. Understand the principles of good visualization design, such as choosing appropriate color schemes and scales. This module emphasizes the importance of visual storytelling, teaching you how to communicate insights and patterns in the data compellingly to stakeholders and team members.",
      },
      {
        title: 'Supervised Learning Algorithms',
        description:
          "Dive deep into <strong>supervised learning</strong>, where models are trained using labeled data. Study algorithms such as <strong>linear regression</strong> for predicting continuous outcomes, <strong>logistic regression</strong> for classification problems, <strong>decision trees</strong>, <strong>random forests</strong>, and <strong>support vector machines (SVM)</strong>. Gain an understanding of the mathematical foundations and assumptions behind each algorithm. Through practical exercises, learn how to implement these algorithms using Python libraries, tune hyperparameters, and interpret model outputs to make informed decisions.",
      },
      {
        title: 'Unsupervised Learning Algorithms',
        description:
          "Explore the realm of <strong>unsupervised learning</strong>, dealing with unlabeled data to discover underlying structures. Study algorithms like <strong>k-means clustering</strong>, <strong>hierarchical clustering</strong>, and <strong>Principal Component Analysis (PCA)</strong>. Learn how to assess the quality of clusters and reduce dimensionality to simplify complex datasets while retaining essential information. This module provides hands-on experience in uncovering patterns and groupings within data, which are crucial for tasks such as customer segmentation and anomaly detection.",
      },
      {
        title: 'Model Evaluation and Selection',
        description:
          "Learn how to evaluate and select the best machine learning models for your tasks. This module covers performance metrics for regression (e.g., <strong>Mean Squared Error</strong>, <strong>R-squared</strong>) and classification (e.g., <strong>Accuracy</strong>, <strong>Precision</strong>, <strong>Recall</strong>, <strong>F1 Score</strong>). Understand the concepts of <strong>overfitting</strong> and <strong>underfitting</strong>, and how to address them using techniques like <strong>cross-validation</strong> and <strong>regularization</strong>. Explore methods for model tuning, such as grid search and random search, to optimize hyperparameters systematically.",
      },
      {
        title: 'Feature Engineering and Selection',
        description:
          "Gain insights into <strong>feature engineering</strong>, the art of transforming raw data into meaningful input for machine learning models. Learn techniques for handling categorical variables (one-hot encoding, label encoding), dealing with missing values, and scaling features. Explore advanced methods such as feature creation through polynomial combinations, interaction terms, and using domain knowledge to enhance model performance. Additionally, study <strong>feature selection</strong> techniques, including filter methods, wrapper methods, and embedded methods, to identify and retain the most influential features while reducing dimensionality.",
      },
      {
        title: 'Advanced Machine Learning Techniques',
        description:
          "Delve into advanced machine learning concepts to enhance model accuracy and robustness. Study <strong>ensemble methods</strong> like <strong>Bagging</strong> (Bootstrap Aggregating) and <strong>Boosting</strong> (including <strong>AdaBoost</strong>, <strong>Gradient Boosting</strong>, and <strong>XGBoost</strong>). Understand how combining multiple models can lead to better performance than individual models. Explore <strong>dimensionality reduction</strong> techniques beyond PCA, such as t-SNE and LDA. This module also introduces concepts like <strong>kernel methods</strong> in SVMs, allowing for nonlinear decision boundaries.",
      },
      {
        title: 'Introduction to Deep Learning',
        description:
          "Embark on the journey into <strong>deep learning</strong> with a focus on <strong>neural networks</strong>. Understand the architecture of neural networks, including layers, neurons, weights, and activation functions. Learn how backpropagation and gradient descent are used to train networks. This module covers building and training neural networks using frameworks like <strong>TensorFlow</strong> and <strong>Keras</strong>, with practical examples on image recognition and natural language processing tasks. Gain insights into convolutional neural networks (CNNs) and recurrent neural networks (RNNs), which are powerful for specific data types.",
      },
      {
        title: 'Natural Language Processing (NLP)',
        description:
          "Delve into <strong>natural language processing</strong> and learn how to process and analyze textual data. Cover text preprocessing steps such as tokenization, stop-word removal, stemming, and lemmatization. Understand techniques like <strong>bag-of-words</strong>, <strong>TF-IDF</strong>, and explore advanced models like <strong>Word Embeddings</strong> (Word2Vec, GloVe). This module also introduces you to building models for sentiment analysis, topic modeling, and language translation using deep learning techniques like sequence-to-sequence models and transformers.",
      },
      {
        title: 'Time Series Analysis and Forecasting',
        description:
          "Understand the unique aspects of <strong>time series data</strong> and how to model temporal dependencies. Learn about time series decomposition, trend analysis, seasonality, and autocorrelation. Study forecasting models such as <strong>ARIMA</strong>, <strong>SARIMA</strong>, and <strong>Exponential Smoothing</strong>. Additionally, explore advanced techniques using <strong>Recurrent Neural Networks (RNNs)</strong> and <strong>Long Short-Term Memory (LSTM)</strong> networks for capturing long-term dependencies in sequential data. Apply these methods to financial data, weather forecasting, and other applications where time-dependent patterns are crucial.",
      },
      {
        title: 'Reinforcement Learning',
        description:
          "Get introduced to <strong>reinforcement learning</strong>, a type of machine learning where agents learn optimal behaviors through trial-and-error interactions with an environment. Study foundational concepts such as <strong>Markov Decision Processes</strong>, <strong>reward functions</strong>, and <strong>policy gradients</strong>. Explore algorithms like <strong>Q-Learning</strong>, <strong>Deep Q-Networks (DQNs)</strong>, and <strong>Policy Optimization</strong>. Understand how reinforcement learning is applied in robotics, gaming (e.g., training AI to play chess or Go), and decision-making systems.",
      },
      {
        title: 'Model Deployment and Serving',
        description:
          "Learn how to transition machine learning models from development to production. This module covers creating RESTful APIs using frameworks like <strong>Flask</strong> or <strong>FastAPI</strong> to serve your models. Understand containerization with <strong>Docker</strong> for consistent deployment environments and orchestration with <strong>Kubernetes</strong>. Explore cloud deployment options using services from <strong>AWS</strong> (SageMaker), <strong>Google Cloud Platform</strong> (AI Platform), and <strong>Microsoft Azure</strong> (Machine Learning Studio). Additionally, learn best practices for monitoring model performance, handling scalability, and implementing continuous integration/continuous deployment (CI/CD) pipelines.",
      },
      {
        title: 'Ethics and Responsible AI',
        description:
          "Examine the ethical considerations and societal impacts of deploying machine learning models. Discuss topics such as <strong>algorithmic bias</strong>, <strong>fairness</strong>, <strong>transparency</strong>, and <strong>accountability</strong>. Learn about regulatory frameworks like <strong>GDPR</strong> and how they affect data handling and privacy. Explore techniques for building explainable AI models and conducting ethical AI audits. This module emphasizes the importance of developing responsible AI systems that align with legal standards and ethical norms.",
      },
      {
        title: 'Case Studies and Industry Applications',
        description:
          "Explore real-world case studies across various industries such as healthcare, finance, e-commerce, and transportation. Analyze how machine learning models are developed and applied to solve complex problems like disease prediction, fraud detection, recommendation systems, and autonomous driving. Learn from successes and challenges in these domains, gaining insights into best practices and strategies for tackling industry-specific issues.",
      },
      {
        title: 'Capstone Projects',
        description:
          "Apply your knowledge in comprehensive <strong>capstone projects</strong>. Choose from projects like developing a sentiment analysis tool, building an image classification system, or creating a predictive maintenance model. Work through all stages of the machine learning pipeline: data collection, preprocessing, exploratory data analysis, model selection, hyperparameter tuning, evaluation, and deployment. Receive feedback and guidance, and build a portfolio that showcases your skills to potential employers.",
      },
    ],
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIcBbGo5FZUXE5xukkNMiu_lv4L5DOywDlKA&s',
      'https://m.media-amazon.com/images/I/71o+UlqkwdL._AC_UF894,1000_QL80_.jpg',
    ],
    links: [
      'https://www.perplexity.ai/search/new?q=Python+Machine+Learning',
      'https://www.perplexity.ai/search/new?q=Data+Preprocessing+in+Python',
      'https://www.perplexity.ai/search/new?q=Machine+Learning+Algorithms',
      'https://www.perplexity.ai/search/new?q=Model+Evaluation+Techniques',
      'https://www.perplexity.ai/search/new?q=Deep+Learning+with+Python',
      'https://www.perplexity.ai/search/new?q=Machine+Learning+Projects',
    ],
  },
  'prime-number-discovery': {
    title: 'Recent Advances in Prime Number Research',
    author: 'mathWhiz',
    likes: 70,
    views: 430,
    timestamp: '1 day ago',
    introduction:
      '<strong>Prime numbers</strong>, fundamental entities in <strong>mathematics</strong>, continue to fascinate researchers. Recent breakthroughs have unveiled new patterns and applications that could revolutionize our understanding of these numbers.',
    subtopics: [
      {
        title: 'Emerging Patterns',
        description:
          'Mathematicians have discovered intriguing patterns in the distribution of <strong>prime numbers</strong>, offering fresh insights into one of the oldest mysteries in <strong>mathematics</strong>. These findings could have profound implications for <strong>number theory</strong> and related fields.',
      },
      {
        title: 'Cryptography Applications',
        description:
          '<strong>Prime numbers</strong> are at the heart of modern <strong>cryptographic systems</strong>, ensuring the security of digital communications. Recent research has led to more efficient methods for generating and testing prime numbers, thereby enhancing the robustness of <strong>encryption algorithms</strong>.',
      },
    ],
    images: [
      'https://media.geeksforgeeks.org/wp-content/uploads/20240912153108/Prime-Numbers.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiZXr4gvamdkoUiJ9t9yrVbhzztRXG1bNsgA&s',
    ],
  },
};

export default function Discover() {
  const [content, setContent] = useState<TopicResponse | null>(null);
  const { subjectId } = useParams<{ subjectId: string }>();
  useEffect(() => {
    const normalizedSubjectId = subjectId.toLowerCase().replace(/ /g, '-');
    setContent(MOCK_CONTENT[normalizedSubjectId]);
  }, [subjectId]);

  if (!content) {
    return <div className="text-white">Content not found</div>;
  }

  return (
    <div className="pt-32 pb-20">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>

        <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>By {content.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{content.likes} likes</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{content.timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{content.views} views</span>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-start mb-6 mt-10">
          <img src="/logo.svg" alt="" />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          {content.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Illustration ${i + 1}`}
              className="rounded-lg shadow-md w-full aspect-video object-cover"
            />
          ))}
        </div>

        <div className="prose max-w-none">
          <p
            className="text-lg mb-4"
            dangerouslySetInnerHTML={{ __html: content.introduction }}
          ></p>

          {content.links && <div className="p-4 bg-gray-100 border border-gray-300 rounded overflow-hidden mb-4">
            <h4 className="text-lg font-medium mb-2">
              References
            </h4>
            <ul className="flex flex-col space-y-2">
              {content.links.map((link, index) => <li key={index} className="flex items-center truncate"><span className="mr-2 text-blue-600">🔗</span><a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{link.replace(/^https?:\/\/(www\.)?perplexity.ai\/search\/new/, 'chat.com\/search')}
              </a>
              </li>)}
            </ul>
          </div>}

          {content.subtopics.map((subtopic, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{subtopic.title}</h2>
              <p
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: subtopic.description }}
              ></p>
            </section>
          ))}

          {content.fun_fact && (
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                {content.fun_fact.title}
              </h3>
              <ul className="list-disc pl-6">
                {content.fun_fact.description.map((fact, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: fact }}></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
