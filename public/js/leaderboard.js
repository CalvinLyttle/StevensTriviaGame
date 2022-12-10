const existingScores = [
    { playerName: "Jonny", score: 80, isUser: false },
    { playerName: "Parag", score: 40, isUser: false },
    { playerName: "Mark Zuck", score: 10, isUser: false },
    { playerName: "Favardin", score: 20, isUser: false }
];

const generateLeaderboardData = (userName, userScore) => {
    let leaderboard = JSON.parse(JSON.stringify(existingScores));
    console.log(leaderboard);
    leaderboard.push({ playerName: userName, score: userScore, isUser: true });
    console.log(leaderboard);
    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard
}

module.exports = { generateLeaderboardData };