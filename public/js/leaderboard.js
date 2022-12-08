const existingScores = [
    { playerName: "Jonny", score: 48, isUser: false },
    { playerName: "Parag", score: 24, isUser: false },
    { playerName: "Mark Zuck", score: 16, isUser: false },
    { playerName: "Favardin", score: 4, isUser: false }
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