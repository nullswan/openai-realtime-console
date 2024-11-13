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
    title: "Maîtriser l'Apprentissage Automatique avec Python",
    author: 'jperrama',
    likes: 85,
    views: 540,
    timestamp: 'il y a 5 heures',
    introduction:
      "Plongez dans le monde de l'<strong>apprentissage automatique</strong> avec <strong>Python</strong> grâce à ce cours complet qui vous guide des <strong>fondamentaux</strong> du langage aux <strong>algorithmes avancés</strong>, idéal pour les débutants comme pour les experts.",
    subtopics: [
      {
        title: 'Fondations de Python',
        description:
          "Ce module couvre les éléments essentiels de <strong>Python</strong>, y compris la <strong>syntaxe</strong>, les <strong>structures de données</strong>, les <strong>fonctions</strong> et les <strong>modules</strong>. Une compréhension solide de ces concepts est cruciale pour aborder les <strong>techniques d'apprentissage automatique</strong>.",
      },
      {
        title: 'Algorithmes de Base en Apprentissage Automatique',
        description:
          'Explorez les <strong>algorithmes supervisés</strong> et <strong>non supervisés</strong> tels que la <strong>régression linéaire</strong>, les <strong>machines à vecteurs de support (SVM)</strong>, les <strong>forêts aléatoires</strong> et le <strong>clustering k-means</strong>. Apprenez à <strong>prétraiter les données</strong>, sélectionner les caractéristiques pertinentes et évaluer les performances des modèles.',
      },
      {
        title: 'Prétraitement des Données et Ingénierie des Caractéristiques',
        description:
          "Comprenez l'importance de <strong>nettoyer</strong> et de <strong>préparer les données</strong> avant d'appliquer des algorithmes d'apprentissage automatique. Cette section aborde la gestion des valeurs manquantes, l'encodage des variables catégorielles, la mise à l'échelle des caractéristiques et la création de nouvelles caractéristiques pour améliorer la précision des modèles.",
      },
      {
        title: 'Évaluation et Validation des Modèles',
        description:
          "Apprenez des techniques pour évaluer les performances de vos modèles d'apprentissage automatique. Les sujets incluent la <strong>validation croisée</strong>, les <strong>matrices de confusion</strong>, la <strong>précision</strong>, le <strong>rappel</strong>, les <strong>scores F1</strong> et les <strong>courbes ROC-AUC</strong>.",
      },
      {
        title: 'Sujets Avancés',
        description:
          "Plongez dans des concepts avancés d'apprentissage automatique tels que les <strong>méthodes d'ensemble</strong>, la <strong>réduction de dimensionnalité</strong> et une introduction à l'<strong>apprentissage profond</strong> avec les <strong>réseaux neuronaux</strong>.",
      },
      {
        title: 'Applications Pratiques',
        description:
          "Appliquez vos connaissances à des scénarios réels, y compris le <strong>traitement du langage naturel</strong>, la <strong>reconnaissance d'images</strong> et la <strong>prévision de séries temporelles</strong>. Ce module met l'accent sur des projets pratiques pour solidifier votre compréhension.",
      },
    ],
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIcBbGo5FZUXE5xukkNMiu_lv4L5DOywDlKA&s',
      'https://m.media-amazon.com/images/I/71o+UlqkwdL._AC_UF894,1000_QL80_.jpg',
    ],
    // resources: [
    //   {
    //     type: 'Livre',
    //     title:
    //       'Apprentissage Automatique avec Scikit-Learn, Keras et TensorFlow',
    //     author: 'Aurélien Géron',
    //     link: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/',
    //   },
    //   {
    //     type: 'Cours en Ligne',
    //     title: 'Apprentissage Automatique avec Python',
    //     provider: 'Coursera',
    //     link: 'https://www.coursera.org/learn/machine-learning-with-python',
    //   },
    //   {
    //     type: 'Documentation',
    //     title: "Guide de l'Utilisateur Scikit-Learn",
    //     link: 'https://scikit-learn.org/stable/user_guide.html',
    //   },
    // ],
    // certification: true,
    // language: 'Français',
    // enrollment_link: 'https://www.example.com/enroll',
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
            className="text-lg mb-8"
            dangerouslySetInnerHTML={{ __html: content.introduction }}
          ></p>

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
