const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let answers = {
    doly_adyny: null,
    doglan_guni: null,
    pishigi: null,
    harakter: null,
    limit: null
}

const askQuestion = (question, key, start) => {
    rl.question(question, (answer) => {
        answers[key] = answer
        askNextQuestion(start)
    })
}

const askNextQuestion = (start) => {
    const remainingQuestions = Object.entries(answers)
        .filter(([key, value]) => value === null)
    if (remainingQuestions.length > 0) {
        const [key, _] = remainingQuestions[0]
        const question = `${key} girizin: `
        askQuestion(question, key, start)
    } else {
        rl.close()
        start(answers)
    }
}

const start = async (answers) => {
    const generateCombinations = (input, limit) => {
        const values = Object.values(input)
        const combin = values.join('')
        const combinations = []
        const generateHelper = (current, remaining) => {
            if (current.length > limit) { return }
            if (current.length > 0) { combinations.push(current) }
            for (let i = 0; i < remaining.length; i++) {
                const newCurrent = current + remaining[i]
                const newRemaining = remaining.slice(0, i) + remaining.slice(i + 1)
                generateHelper(newCurrent, newRemaining)
            }
        }
        generateHelper('', combin)
        return combinations
    }
    const limit = answers.limit || 4
    const filename = answers.doly_adyny || 'wordlist'
    const result = generateCombinations(answers, limit)
    result.forEach((item) => {
        fs.appendFileSync(`${filename}.txt`, item + '\n', 'utf8')
    })
}

askNextQuestion(start)