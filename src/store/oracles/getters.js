export const leaders = ({ leaderboard }) => {
    let leaders = [];
    Object.keys(leaderboard).map((key, index) => {
      let row = leaderboard[key];
      leaders.push({ oracle: key, ...row });
    });
    return leaders
}