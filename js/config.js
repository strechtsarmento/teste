// Dados estáticos do edital e metadados de exercícios.
export const incidenciaGeral = {
    "CONHECIMENTOS BANCARIOS": 27.66, "VENDAS E NEGOCIACAO": 26.56, "LINGUA PORTUGUESA": 14.25,
    "INFORMATICA": 10.05, "MATEMATICA": 9.59, "ATUALIDADES DO MERCADO FINANCEIRO": 3.85,
    "MATEMATICA FINANCEIRA": 3.39, "LINGUA INGLESA": 2.84
};

export const incidenciasDetalhadas = {
    "LINGUA PORTUGUESA": [
        ["Interpretação de textos; reescrita", "36,77%"],
        ["Semântica; regência verbal/nominal", "16,86%"],
        ["Classes de Palavras; formation", "13,35%"],
        ["Ortografia; acentuação; crase", "10,30%"],
        ["Concordância; vozes verbais", "8,90%"],
        ["Tempos e modos verbais", "5,39%"],
        ["Termos da oração; Partícula 'se/que'", "2,81%"],
        ["Pronomes; Colocação pronominal", "2,34%"],
        ["Coordenação/Subordinação; Pontuação", "2,11%"],
        ["Tipologia; Fonética", "1,17%"]
    ],
    "MATEMATICA": [
        ["Lógica proposicional", "32,00%"],
        ["Porcentagens", "18,00%"],
        ["Razões e proporções", "11,00%"],
        ["Números inteiros, racionais e reais", "10,00%"],
        ["Noções de conjuntos", "8,00%"],
        ["Sequências", "6,00%"],
        ["PA e PG", "5,00%"],
        ["Matrizes; Determinantes; Sistemas", "3,00%"],
        ["Regra de três", "3,00%"],
        ["Sistema de medidas", "2,00%"],
        ["Divisão proporcional", "2,00%"],
        ["Funções (Polinomial, Exp, Log)", "1,00%"]
    ],
    "ATUALIDADES DO MERCADO FINANCEIRO": [
        ["Funções da moeda", "60,00%"],
        ["Transformação digital no SFN", "20,00%"],
        ["Segmentação; Internet banking", "6,66%"],
        ["Bancos na Era Digital; Tendências", "6,66%"],
        ["Correspondentes bancários", "6,66%"]
    ],
    "MATEMATICA FINANCEIRA": [
        ["Juros Compostos", "39,00%"],
        ["Juros Simples", "28,33%"],
        ["Sistemas de amortização", "19,33%"],
        ["Conceitos gerais", "13,33%"]
    ],
    "CONHECIMENTOS BANCARIOS": [
        ["Sistema Financeiro Nacional", "30,00%"],
        ["Noções de Mercado de capitais", "15,00%"],
        ["Produtos bancários", "15,00%"],
        ["Mercado financeiro (Monet/Créd/Camb)", "9,00%"],
        ["Moeda e política monetária", "9,00%"],
        ["Garantias do SFN", "6,00%"],
        ["LGPD", "4,00%"],
        ["Mercado de Câmbio", "4,00%"],
        ["Ética aplicada", "3,00%"],
        ["Lavagem de dinheiro", "2,00%"],
        ["Mercado interbancário", "1,00%"],
        ["Taxas Nominais/Reais/Fluxo", "1,99%"]
    ],
    "INFORMATICA": [
        ["Segurança da informação", "25,00%"],
        ["Navegador Web", "19,00%"],
        ["Sistemas operacionais", "13,00%"],
        ["Correio eletrônico", "9,00%"],
        ["Análise de dados", "7,00%"],
        ["Gerenciamento de arquivos/pastas", "7,00%"],
        ["Redes de computadores", "5,00%"],
        ["Suporte à decisão (BI)", "4,00%"],
        ["Proteção de estações (Hardening)", "3,00%"],
        ["Redes Sociais; Wikis", "3,00%"],
        ["Office (Texto/Planilha/Pres)", "2,00%"],
        ["Multimídia", "1,00%"],
        ["Educação a distância", "1,00%"]
    ],
    "VENDAS E NEGOCIACAO": [
        ["Lei Brasileira de Inclusão", "25,00%"],
        ["Gestão da qualidade em serviços", "17,00%"],
        ["Valor percebido; Experiência cliente", "15,00%"],
        ["Sustentabilidade organizational", "15,00%"],
        ["CDC (Lei 8.078)", "11,00%"],
        ["Padrões de atendimento", "5,00%"],
        ["Ética e conduta em vendas", "3,00%"],
        ["Técnicas de vendas", "3,00%"],
        ["Resolução CMN 3.694", "3,00%"],
        ["Noções de marketing digital", "1,00%"],
        ["Characteristics dos serviços", "1,00%"]
    ],
    "LINGUA INGLESA": [["Vocabulário e Gramática", "100%"]]
};

export const temas = {
    "LINGUA PORTUGUESA":["Compreensão de textos","Ortografia oficial","Classe e emprego de palavras","Emprego do acento indicativo di crase","Sintaxe da oração e do período","Emprego dos sinais de pontuação","Concordância verbal e nominal","Regência verbal e nominal","Colocação dos pronomes oblíquos átonos"],
    "LINGUA INGLESA":["Vocabulário fundamental","Aspectos gramaticais básicos"],
    "MATEMATICA":["Números inteiros, racionais e reais","Problemas de contagem","Sistema legal de medidas","Razões e proporções","Divisão proporcional","Regra de três simples","Regra de três composta","Porcentagens","Lógica proposicional","Noções de conjuntos","Relações e funções","Funções polinomiais","Funções exponenciais","Funções logarítmicas","Matrizes","Determinantes","Sistemas lineares","Sequências","Progressão aritmética","Progressão geométrica"],
    "ATUALIDADES DO MERCADO FINANCEIRO":["Bancos na Era Digital","Internet banking","Mobile banking","Open banking","Novos modelos de negócios","Fintechs, startups e big techs","Sistema de bancos-sombra","Funções da moeda","Blockchain e criptomedas","Marketplace","Correspondentes bancários","Arrenjos de pagamentos","PIX","Segmentação digital","Transformação digital no Sistema Financeiro"],
    "MATEMATICA FINANCEIRA":["Valor do dinheiro no tempo","Capital, juros e taxas","Capitalização","Fluxo de caixa","Equivalência financeira","Juros simples","Juros compostos","Sistema Price","Sistema SAC"],
    "CONHECIMENTOS BANCARIOS":["Sistema Financeiro Nacional","Órgãos normativos","Mercado monetário","Mercado de crédito","Mercado de capitais","Mercado cambial","Política monetária","Taxa SELIC","Orçamento público","Produtos bancários","Regimes cambiais","Diferencial de juros","Mercado interbancário","Operações bancárias","Curva de juros","Garantias do SFN","Lavagem de dinheiro","Autorregulação bancária","Sigilo bancário","LGPD","Lei anticorrupção","Segurança cibernética","Ética empresarial","Código de Ética BB","Responsabilidade socioambientael BB","ASG"],
    "INFORMATICA":["Windows 10","Linux SLES","Word O365","Excel O365","PowerPoint O365","Segurança da informação","Proteção de estações","Gerenciamento de arquivos","Redes de computadores","Navegadores Web","Correio eletrônico","Redes sociais","Sistemas de suporte à decisão","Análise de dados","Educação a distância","Tecnologias multimídia","Ferramentas remotas"],
    "VENDAS E NEGOCIACAO":["Estratégia empresarial","Segmentação de mercado","Valor percebido","Experiência do cliente","Sustentabilidade organizational","Características dos serviços","Qualidade em serviços","Técnicas de vendas","Marketing digital","Ética profissional","Qualidade no atendimento","Canais remotos","Comportamento do consumidor","Política de relacionamento","Ouvidoria","Lei Brasileira de Inclusão","CDC"]
};

// =========================================================================
// ⚙️ CONTROLE DE ESTADO LOCAL E OPERACIONAL (BLINDADO)
// =========================================================================
export const EXERCISE_SUBJECTS = [
    { key: "LINGUA PORTUGUESA", id: "ex-port", label: "Lingua Portuguesa" },
    { key: "LINGUA INGLESA", id: "ex-ingles", label: "Lingua Inglesa" },
    { key: "MATEMATICA", id: "ex-mat", label: "Matematica" },
    { key: "CONHECIMENTOS BANCARIOS", id: "ex-banc", label: "Conhecimentos Bancarios" },
    { key: "MATEMATICA FINANCEIRA", id: "ex-matfin", label: "Matematica Financeira" },
    { key: "INFORMATICA", id: "ex-info", label: "Informatica" },
    { key: "VENDAS E NEGOCIACAO", id: "ex-vendas", label: "Vendas e Negociacoes" },
    { key: "ATUALIDADES DO MERCADO FINANCEIRO", id: "ex-atual", label: "Atualidades do Mercado Financeiro" }
];

export const EXERCISE_SUBJECTS_MAP = Object.fromEntries(
    EXERCISE_SUBJECTS.map((subject) => [subject.key, subject])
);
