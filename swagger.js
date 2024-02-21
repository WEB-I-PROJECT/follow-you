const swaggerAutogen = require('swagger-autogen')()
const outputFile = './swagger_output.json'
const endpointsFiles = ['./apiRoutes.js']


const doc = {
    info: {
        version: "1.0.0",
        title: "HUB NEWS",
        description: "Documentação da API."
    },
    host: "localhost:8001",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Analytic",
            "description": "Endpoints"
        },
        {
            "name": "Users",
            "description": "Endpoints"

        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    },
    definitions: {
        WordsFrequency: {
            mostFrequentWordsInContent: [
                {
                    word: "governo",
                    frequency: 760
                },
                {
                    word: "brasil",
                    frequency: 738
                },
                {
                    word: "ensino",
                    frequency: 732
                }
            ]
        },
        WordsCharts: {
            labels: [
                "3-3-2021",
                "9-11-2021",
                "7-2-2022",
            ],
            data: [
                1,
                1,
                1,

            ]
        },
        NewsKeyword: {
            news: [
                {
                    date: " 06/10/2022 às 16:03 ",
                    img: "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/08/FTA20220905046-e1664892465983.jpg?w=347",
                    title: "Boris Casoy: Pesquisando as pesquisas",
                    url: "https://www.cnnbrasil.com.br/politica/boris-casoy-pesquisando-as-pesquisas/"
                },
                {
                    date: " 23/09/2022 às 08:42 ",
                    img: "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/05/Copia-de-16x9-Podcast-WW.png?w=347",
                    title: "As pesquisas eleitorais são confiáveis?",
                    url: "https://www.cnnbrasil.com.br/politica/as-pesquisas-eleitorais-sao-confiaveis/"
                }
            ]
        },
        UserList:
            [
                {
                    "_id": "65b193785cbb532f21341011",
                    "name": "John Galdino",
                    "email": "john@gmail.com",
                    "address": "Guanambi - Caetite - IF",
                    "cpf": "908.978.666-44",
                    "phone": "(77) 66655-4444",
                    "password": "$2a$10$bPkZZJA6vAmVE9Y1pRkrx.0HvB6WgMXAQFZ.fGBCLHl.x7dqldRLO",
                    "isAdmin": true,
                    "approved": true,
                    "createdAt": "2024-01-24T22:47:20.691Z",
                    "updatedAt": "2024-02-14T20:05:12.420Z",
                    "__v": 0,
                    "profilePicture": "/uploads/Untitled.png"
                }
            ],

        newsCategory: {
            news: [
                {
                    date: " 06/10/2022 às 16:03 ",
                    img: "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/08/FTA20220905046-e1664892465983.jpg?w=347",
                    title: "Boris Casoy: Pesquisando as pesquisas",
                    url: "https://www.cnnbrasil.com.br/politica/boris-casoy-pesquisando-as-pesquisas/"
                },
                {
                    date: " 23/09/2022 às 08:42 ",
                    img: "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/05/Copia-de-16x9-Podcast-WW.png?w=347",
                    title: "As pesquisas eleitorais são confiáveis?",
                    url: "https://www.cnnbrasil.com.br/politica/as-pesquisas-eleitorais-sao-confiaveis/"
                }
            ]
        },

        SentimentAnlaises: {

            ig: {
                'detecção de objetos': { Positivas: 0, Negativas: 6, Neutras: 0 },
                'processamento de imagens': { Positivas: 2, Negativas: 5, Neutras: 0 }
            },
            cnn: {
                'Visão Computacional': { Positivas: 45, Negativas: 15, Neutras: 3 },
                'detecção de objetos': { Positivas: 47, Negativas: 39, Neutras: 4 },
                'processamento de imagens': { Positivas: 48, Negativas: 39, Neutras: 3 },
                'detecção autonôma': { Positivas: 18, Negativas: 9, Neutras: 0 }
            },
            "brasil-de-fato": {
                'processamento de imagens': { Positivas: 9, Negativas: 21, Neutras: 0 }
            }
        },
        NewsSentiment: {

            "newsSentimentGroup": {
                "Chat GPT": [
                    {
                        "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRTpTMipMk5HDcVS4jPGYTboz47Lp_stFZInuld9T87yj0b8Lau1t_DTOo2",
                        "title": "OpenAI apresenta nova solução que cria vídeos a partir de textos",
                        "origin": "ig",
                        "tags": [
                            "IG",
                            "Inovao",
                            "OpenAI",
                            "Sora",
                            "Vdeos"
                        ],
                        "totalPositiveWords": 10,
                        "positiveWords": "solução, divulgação, rapidamente, acordo, céu, aventuras, resolver, ampliar, capaz, homenagem",
                        "totalNegativeWords": 7,
                        "negativeWords": "violação, não, limitado, ódio, violência, exigem, problemas",
                        "date": "2024-02-16T14:05:00.000Z"
                    },
                    {
                        "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRTpTMipMk5HDcVS4jPGYTboz47Lp_stFZInuld9T87yj0b8Lau1t_DTOo2",
                        "title": "OpenAI apresenta nova solução que cria vídeos a partir de textos",
                        "origin": "ig",
                        "tags": [
                            "IG",
                            "Inovao",
                            "OpenAI",
                            "Sora",
                            "Vdeos"
                        ],
                        "totalPositiveWords": 10,
                        "positiveWords": "solução, divulgação, rapidamente, acordo, céu, aventuras, resolver, ampliar, capaz, homenagem",
                        "totalNegativeWords": 7,
                        "negativeWords": "violação, não, limitado, ódio, violência, exigem, problemas",
                        "date": "2024-02-16T14:05:00.000Z"
                    }],
                "Visão Computacional": [
                    {
                        "image": "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/06/220608113231-01-repeating-fast-radio-burst.jpg?w=347",
                        "title": " Cientistas criam prótese que permite que pessoas sintam temperatura ",
                        "origin": "cnn",
                        "tags": [
                            "Amputação",
                            "Ciência",
                            "Estudo"
                        ],
                        "totalPositiveWords": 8,
                        "positiveWords": "bem, importante, maior, capaz, sucesso, calor, acordo, permitir",
                        "totalNegativeWords": 7,
                        "negativeWords": "não, adverte, risco, reduzir, morte, fantasma, dor",
                        "date": "2024-02-09T22:11:00.000Z"
                    },
                    {
                        "image": "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/03/WhatsApp-Image-2022-03-17-at-17.27.40-e1647558325314.jpeg?w=347",
                        "title": " Cientistas criam prótese que permite que pessoas sintam temperatura ",
                        "origin": "cnn",
                        "tags": [
                            "Amputação",
                            "Ciência",
                            "Estudo"
                        ],
                        "totalPositiveWords": 8,
                        "positiveWords": "bem, importante, maior, capaz, sucesso, calor, acordo, permitir",
                        "totalNegativeWords": 7,
                        "negativeWords": "não, adverte, risco, reduzir, morte, fantasma, dor",
                        "date": "2024-02-09T22:11:00.000Z"
                    } ]
                }
            },
            AnalyticUser:
            {
                "analytics": [
                    {
                        "_id": "65c49dbbc5b234fcdc8a017e",
                        "name": "Inteligência Artificial",
                        "createdAt": "2024-02-08T08:57:08.222Z",
                        "type": "by-keywords",
                        "User": "65b36f0519b6c96b32b8ac3e",
                        "__v": 0
                    },
                    {
                        "_id": "65d4e02b46712317a3dfb6c7",
                        "name": "vanubia",
                        "createdAt": "2024-02-20T17:23:14.187Z",
                        "type": "by-category",
                        "category": "65b2b86fcf67b92db75e22bd",
                        "User": "65b36f0519b6c96b32b8ac3e",
                        "__v": 0
                    }
                ]
            },
            AddAnaly: 
                {
                    "name": "Economia",
                    "type": "by-category",
                    "category": "Finanças",
                    "user": "65b36f0519b6c96b32b8ac3e"
                }
                        
            

        }
    }

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
        require('./app.js')
    })