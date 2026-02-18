import { type Question } from '../types';

export const QUESTIONS: Question[] = [
    // EASY (Levels 1-5) - Estagiário / Júnior
    {
        id: "1",
        text: "Qual tag HTML é usada para criar um link?",
        options: [
            { id: "0", text: "<link>" },
            { id: "1", text: "<a>" },
            { id: "2", text: "<href>" },
            { id: "3", text: "<url>" }
        ],
        correctAnswer: "1",
        correctDetails: "<a> (Anchor)",
        difficulty: 'easy'
    },
    {
        id: "2",
        text: "Qual comando Git é usada para enviar alterações para o repositório remoto?",
        options: [
            { id: "0", text: "git pull" },
            { id: "1", text: "git save" },
            { id: "2", text: "git push" },
            { id: "3", text: "git upload" }
        ],
        correctAnswer: "2",
        correctDetails: "git push",
        difficulty: 'easy'
    },
    {
        id: "3",
        text: "Em CSS, qual propriedade altera a cor do texto?",
        options: [
            { id: "0", text: "font-color" },
            { id: "1", text: "text-color" },
            { id: "2", text: "color" },
            { id: "3", text: "background" }
        ],
        correctAnswer: "2",
        correctDetails: "color",
        difficulty: 'easy'
    },
    {
        id: "4",
        text: "Qual destas NÃO é uma metodologia Ágil?",
        options: [
            { id: "0", text: "Scrum" },
            { id: "1", text: "Kanban" },
            { id: "2", text: "Waterfall" },
            { id: "3", text: "XP" }
        ],
        correctAnswer: "2",
        correctDetails: "Waterfall (Cascata)",
        difficulty: 'easy'
    },
    {
        id: "5",
        text: "Qual o significado da sigla 'JS'?",
        options: [
            { id: "0", text: "JavaSource" },
            { id: "1", text: "JavaScript" },
            { id: "2", text: "JsonScript" },
            { id: "3", text: "JavaSystem" }
        ],
        correctAnswer: "1",
        correctDetails: "JavaScript",
        difficulty: 'easy'
    },

    // MEDIUM (Levels 6-10) - Pleno / Sênior
    {
        id: "6",
        text: "No Scrum, quanto tempo (máximo) deve durar a Daily?",
        options: [
            { id: "0", text: "15 minutos" },
            { id: "1", text: "30 minutos" },
            { id: "2", text: "1 hora" },
            { id: "3", text: "O tempo que precisar" }
        ],
        correctAnswer: "0",
        correctDetails: "15 minutos",
        difficulty: 'medium'
    },
    {
        id: "7",
        text: "Qual hook do React é usado para gerenciar estado?",
        options: [
            { id: "0", text: "useEffect" },
            { id: "1", text: "useContext" },
            { id: "2", text: "useState" },
            { id: "3", text: "useStateful" }
        ],
        correctAnswer: "2",
        correctDetails: "useState",
        difficulty: 'medium'
    },
    {
        id: "8",
        text: "O que significa 'API'?",
        options: [
            { id: "0", text: "Application Programming Interface" },
            { id: "1", text: "Advanced Protocol Interface" },
            { id: "2", text: "App Program Instruction" },
            { id: "3", text: "Automated Process Interaction" }
        ],
        correctAnswer: "0",
        correctDetails: "Application Programming Interface",
        difficulty: 'medium'
    },
    {
        id: "9",
        text: "Qual destes códigos de status HTTP indica 'Não Encontrado'?",
        options: [
            { id: "0", text: "200" },
            { id: "1", text: "500" },
            { id: "2", text: "403" },
            { id: "3", text: "404" }
        ],
        correctAnswer: "3",
        correctDetails: "404 Not Found",
        difficulty: 'medium'
    },
    {
        id: "10",
        text: "Quem é o Product Owner (PO) no Scrum?",
        options: [
            { id: "0", text: "O chefe dos desenvolvedores" },
            { id: "1", text: "Quem define 'O Que' será feito" },
            { id: "2", text: "Quem define 'Como' será feito" },
            { id: "3", text: "O cliente final" }
        ],
        correctAnswer: "1",
        correctDetails: "Quem define 'O Que' será feito (Gerencia o Backlog)",
        difficulty: 'medium'
    },

    // HARD (Levels 11-15) - Lead / Principal / CTO
    {
        id: "11",
        text: "Qual princípio SOLID refere-se à 'S' (Single Responsibility)?",
        options: [
            { id: "0", text: "Uma classe deve ter várias responsabilidades" },
            { id: "1", text: "Uma classe deve ter apenas um motivo para mudar" },
            { id: "2", text: "Sempre use Singleton" },
            { id: "3", text: "Separe as interfaces" }
        ],
        correctAnswer: "1",
        correctDetails: "Uma classe deve ter apenas um motivo para mudar",
        difficulty: 'hard'
    },
    {
        id: "12",
        text: "O que é 'Race Condition'?",
        options: [
            { id: "0", text: "Uma competição de hackers" },
            { id: "1", text: "Um erro de compilação" },
            { id: "2", text: "Comportamento inesperado por ordem de execução de threads" },
            { id: "3", text: "Quando o loop é infinito" }
        ],
        correctAnswer: "2",
        correctDetails: "Comportamento inesperado dependente da sequência ou tempo de threads",
        difficulty: 'hard'
    },
    {
        id: "13",
        text: "Qual destes bancos de dados é NoSQL?",
        options: [
            { id: "0", text: "PostgreSQL" },
            { id: "1", text: "MySQL" },
            { id: "2", text: "MongoDB" },
            { id: "3", text: "Oracle" }
        ],
        correctAnswer: "2",
        correctDetails: "MongoDB",
        difficulty: 'hard'
    },
    {
        id: "14",
        text: "No Manifesto Ágil, valorizamos mais 'Indivíduos e interações' do que...",
        options: [
            { id: "0", text: "Documentação abrangente" },
            { id: "1", text: "Processos e ferramentas" },
            { id: "2", text: "Negociação de contratos" },
            { id: "3", text: "Seguir um plano" }
        ],
        correctAnswer: "1",
        correctDetails: "Processos e ferramentas",
        difficulty: 'hard'
    },
    {
        id: "15",
        text: "O que caracteriza uma arquitetura 'Serverless'?",
        options: [
            { id: "0", text: "Não existem servidores físicos no mundo" },
            { id: "1", text: "O desenvolvedor não gerencia a infraestrutura do servidor" },
            { id: "2", text: "O servidor roda localmente" },
            { id: "3", text: "É usada apenas para sites estáticos" }
        ],
        correctAnswer: "1",
        correctDetails: "O desenvolvedor não gerencia a infraestrutura (FaaS, etc)",
        difficulty: 'hard'
    },

    // MILLION (Level 16) - Agile Master
    {
        id: "16",
        text: "Em que ano foi publicado o Manifesto Ágil?",
        options: [
            { id: "0", text: "1995" },
            { id: "1", text: "2001" },
            { id: "2", text: "2005" },
            { id: "3", text: "2010" }
        ],
        correctAnswer: "1",
        correctDetails: "2001 (Snowbird, Utah)",
        difficulty: 'million'
    }
];

export const PRIZE_LADDER = [
    { level: 1, prize: 1000, stop: 0, wrong: 0, title: "Intern" },
    { level: 2, prize: 2000, stop: 1000, wrong: 500, title: "Trainee" },
    { level: 3, prize: 3000, stop: 2000, wrong: 1000, title: "Junior Dev" },
    { level: 4, prize: 4000, stop: 3000, wrong: 1500, title: "Software Eng I" },
    { level: 5, prize: 5000, stop: 4000, wrong: 2000, title: "Mid-Level Dev" },
    { level: 6, prize: 10000, stop: 5000, wrong: 2500, title: "Software Eng II" },
    { level: 7, prize: 20000, stop: 10000, wrong: 5000, title: "Senior Eng I" },
    { level: 8, prize: 30000, stop: 20000, wrong: 10000, title: "Senior Eng II" },
    { level: 9, prize: 40000, stop: 30000, wrong: 15000, title: "Tech Lead" },
    { level: 10, prize: 50000, stop: 40000, wrong: 20000, title: "Eng Manager" },
    { level: 11, prize: 100000, stop: 50000, wrong: 25000, title: "Staff Eng" },
    { level: 12, prize: 200000, stop: 100000, wrong: 50000, title: "Principal Eng" },
    { level: 13, prize: 300000, stop: 200000, wrong: 100000, title: "Architect" },
    { level: 14, prize: 400000, stop: 300000, wrong: 150000, title: "VP of Eng" },
    { level: 15, prize: 500000, stop: 400000, wrong: 200000, title: "CTO" },
    { level: 16, prize: 1000000, stop: 0, wrong: 0, title: "Agile Master" }
];
