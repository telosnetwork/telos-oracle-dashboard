export const updatePriceFeeds = (state, pFeeds) => {
    
    if(state.bPriceFeeds == false)
    { state.bPriceFeeds = true; }
    
    state.priceFeeds.unshift(pFeeds);

    var len = state.priceFeeds.length;

    if(len > 200)
    { len = 200; }

    state.priceFeeds = state.priceFeeds.slice(0, len);
};

export const setLeaderboard = (state, leaderboard) => {
    state.leaderboard = leaderboard;
}