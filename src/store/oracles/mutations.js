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

export const updateRNGFeeds = (state, nRNG) => {

  if(state.bRNGFeeds == false)
  { state.bRNGFeeds = true; }

  state.rngFeeds.unshift(nRNG);

  var len = state.rngFeeds.length;

  if(len > 20)
  { len = 20; }

  state.rngFeeds = state.rngFeeds.slice(0, len);
};
