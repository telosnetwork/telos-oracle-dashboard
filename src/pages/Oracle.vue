<template>
  <q-page class="column justify-center items-center" style="background-color: #111;">

    <div class="text-h4" style="color: #fafafa;">
      <p>&nbsp;</p>
      {{oracleTitle}}
    </div>

    <div style="text-align: center; color: #fafafa;">
        Price oracles are streamed live from the blockchain using hyperion, with price updates occuring every few seconds.<br>
        Contracts may access the data from the <a :href="`${explorerUrl}/account/delphioracle`" target="_blank" style="color: #571aff;">delphioracle</a> contract.
    </div>

  <canvas onmousemove='' onclick='' id='telosCanvas' style='border: none; background-color: #111; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block;'>
  </canvas>

    <img id="imgOracleSmall" alt="" src="~assets/o_small.png" width="177" height="177" hidden/>
    <img id="imgOracleSmallb" alt="" src="~assets/o_smallb.png" width="177" height="177" hidden/>
    <img id="imgOracleSmallc" alt="" src="~assets/o_smallc.png" width="177" height="177" hidden/>

    <img id="imgGlowSmall_a" alt="" src="~assets/glow_SMALLa.png" width="177" height="177" hidden/>
    <img id="imgGlowSmall_b" alt="" src="~assets/glow_SMALLb.png" width="177" height="177" hidden/>
    <img id="imgGlowSmall_c" alt="" src="~assets/glow_SMALLc.png" width="177" height="177" hidden/>
    <img id="imgGlowSmall_d" alt="" src="~assets/glow_SMALLd.png" width="177" height="177" hidden/>
    <img id="imgGlowSmall_e" alt="" src="~assets/glow_SMALLe.png" width="177" height="177" hidden/>
    <img id="imgGlowSmall_f" alt="" src="~assets/glow_SMALLf.png" width="177" height="177" hidden/>

    <img id="imgOracleMed" alt="" src="~assets/o_med.png" width="354" height="354" hidden/>
    <img id="imgOracleMedb" alt="" src="~assets/o_medb.png" width="354" height="354" hidden/>
    <img id="imgOracleMedc" alt="" src="~assets/o_medc.png" width="354" height="354" hidden/>

    <img id="imgGlowMed_a" alt="" src="~assets/glow_MEDa.png" width="354" height="354" hidden/>
    <img id="imgGlowMed_b" alt="" src="~assets/glow_MEDb.png" width="354" height="354" hidden/>
    <img id="imgGlowMed_c" alt="" src="~assets/glow_MEDc.png" width="354" height="354" hidden/>
    <img id="imgGlowMed_d" alt="" src="~assets/glow_MEDd.png" width="354" height="354" hidden/>
    <img id="imgGlowMed_e" alt="" src="~assets/glow_MEDe.png" width="354" height="354" hidden/>
    <img id="imgGlowMed_f" alt="" src="~assets/glow_MEDf.png" width="354" height="354" hidden/>

    <img id="ta" alt="" src="~assets/ta.png" width="177" height="177" hidden/>
    <img id="tb" alt="" src="~assets/tb.png" width="177" height="177" hidden/>
    <img id="tc" alt="" src="~assets/tc.png" width="177" height="177" hidden/>
    <img id="td" alt="" src="~assets/td.png" width="177" height="177" hidden/>
    <img id="te" alt="" src="~assets/te.png" width="177" height="177" hidden/>

    <img id="tma" alt="" src="~assets/tma.png" width="354" height="354" hidden/>
    <img id="tmb" alt="" src="~assets/tmb.png" width="354" height="354" hidden/>
    <img id="tmc" alt="" src="~assets/tmc.png" width="354" height="354" hidden/>
    <img id="tmd" alt="" src="~assets/tmd.png" width="354" height="354" hidden/>
    <img id="tme" alt="" src="~assets/tme.png" width="354" height="354" hidden/>

    <audio id="blip1" autoplay="false" src="~assets/cc0/vgmenuhighlight.ogg" style="display: none;" />
    <audio id="lA" autoplay="false" src="~assets/cc0/cogs.ogg" style="display: none;" />
    <audio id="lB" autoplay="false" src="~assets/cc0/explode.ogg" style="display: none;" />
  </q-page>
</template>

<script>
const moment = require("moment");

export default {
  data() {
    return {
      explorerUrl: process.env.NETWORK_EXPLORER,
      oracleTitle: "Telos Price Oracles",
      bRenderCanvas: false,
      moment,
      lastTimestamp: null,
      lastBlock: 0,
      oldBlock: 0,
      uCount: 0,
      lCountdown: 0,
      lCounter: 0,
      lAnim: 0,
      yCounter: 0,
      oRender: [],
      imgSize: 0,
      imgOracle: [],
      imgLightning: [],
      laserCount: 0,
      fadeCount: 0,
      tCount: 0,
      imgT: [],
      winResize: false,
    };
  },
  methods: {
    tImg(dim) {
      return (this.imgSize+1) * dim;
    },
    resizeCheck() {
      var canvas = document.getElementById("telosCanvas");
      var fUpdateCanvasSize = this.updateCanvasSize;

      if(this.winResize == false) {
        this.winResize = true;
        setTimeout(function() { fUpdateCanvasSize(canvas); }, 150);
      }
    },
    updateCanvasSize(canvas) {

      if(this.winResize == true){
        var ww = $(window).width();
        var wh = $(window).height();

        var setWidth = ww;
        var setHeight = 400;

        this.imgSize = 0;

        if(ww > 800) {
          setWidth = 800;
        }
        if(ww > 1000) {
          setWidth = 1000;
          setHeight = 700;
          this.imgSize = 1;
        }

        if( $(canvas).width() == setWidth )
        { this.winResize = false; return; }

        //Update Settings for Main Canvas
        var c_width = setWidth;
        var c_height = setHeight;
        $(canvas).width(c_width);
        $(canvas).height(c_height);
        $(canvas).attr('width', ''+c_width).attr('height', ''+c_height);

        this.winResize = false;
      }
    },
    renderText(ctx, x, y, color, font, text) {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(text, x, y);
    },
    getPairText(pair){
      switch(pair) {
        case "tlosusd":
          return "TLOS/USD";
          break;
        case "tlosbtc":
          return "satoshi";
          break;
        case "tloseos":
          return "TLOS/EOS";
          break;
      }
    },
    getDivisor(pair){
      switch(pair) {
        case "tlosusd":
          return 10000;
          break;
        case "tlosbtc":
          return 1;
          break;
        case "tloseos":
          return 10000;
          break;
      }
    },
    renderOracles(canvas, ctx, priceFeeds, nRenderX, nRenderY){

      var fSize = this.imgSize == 0 ? "14px Arial" : "22px Courier New";
      var fSize2 = this.imgSize == 0 ? "10px Arial" : "11px Courier New";
      var nSpacing = this.imgSize == 0 ? 35 : 45;

      var nRawVal = 0;
      var nDiv = 0;
      var nVal = 0;
      var iSpace = nSpacing  + (60 - this.yCounter);
      var fade = 0;

      for(var i=0; (i < priceFeeds.length) && (i < 6); i++){

            if(i==0 && (this.fadeCount > 0))
            {
              this.fadeCount = this.fadeCount - 5;
              fade = 30 + this.fadeCount;
            } else {
              fade = 0;
            }

            if(i==0 && (this.laserCount > 0))
            {
              var xLaserA = this.imgSize == 0 ? 50 - fade + 100 : 50 - fade + 160;
              var yLaserA = this.imgSize == 0 ? 50 - fade + 30 : iSpace - fade;
              var xLaserB = this.imgSize == 0 ? nRenderX : nRenderX;
              var yLaserB = this.imgSize == 0 ? nRenderY + 70 : nRenderY + 138;

              ctx.lineWidth = 4;
              ctx.strokeStyle = "#4440f3";
              ctx.beginPath();
              ctx.moveTo(xLaserA, yLaserA);
              ctx.lineTo(xLaserB, yLaserB);
              ctx.stroke();

              ctx.lineWidth = 1;
              ctx.strokeStyle = "#fff";
              ctx.beginPath();
              ctx.moveTo(xLaserA, yLaserA);
              ctx.lineTo(xLaserB, yLaserB);
              ctx.stroke();

              this.laserCount--;
            }
            this.renderText( ctx, 50 - fade, iSpace - fade, "#fafafa", fSize, priceFeeds[i].act.data.owner);

            iSpace = iSpace + nSpacing - 24;

            for(var i2=0; i2 < priceFeeds[i].act.data.quotes.length; i2++){
              nRawVal = priceFeeds[i].act.data.quotes[i2].value;
              nDiv = this.getDivisor(priceFeeds[i].act.data.quotes[i2].pair);
              nVal = parseFloat(nRawVal / nDiv);
              this.renderText( ctx, 60 - fade, iSpace - fade, "#fafafa", fSize2, nVal + " " + this.getPairText(priceFeeds[i].act.data.quotes[i2].pair));
              iSpace = iSpace + nSpacing - 24;
            }
            iSpace = iSpace - (nSpacing - 24);
            iSpace = iSpace + nSpacing;
      }
    },
    renderCanvas(checkMounted) {
      if(checkMounted){
        if(gRenderLoopForceStop == true)
        { console.log("ENDED old Render Loop"); gRenderLoopForceStop = false; return; }
      } else {
        gRenderLoopForceStop = false;
      }


      if(this.bRenderCanvas) {

        if (this.$store.state.oracles.priceFeeds != undefined) {
          if (this.$store.state.oracles.priceFeeds.length > 0) {
            this.lastTimestamp = this.$store.state.oracles.priceFeeds[0]["@timestamp"];
          }
        }

        var canvas = document.getElementById("telosCanvas");
        var cw = $(canvas).width();
        var ch = $(canvas).height();

      if(canvas !== null) {
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        var hSubtract = (ch >= 690) ? 100 : 0;
        var lightBulb = 0;

        if (this.uCount > 8) {
          lightBulb = 1;
        } else if (this.uCount > 5) {
          lightBulb = 2;
        } else if (this.uCount > 2) {
          lightBulb = 1;
        } else if (this.uCount > 1) {
          lightBulb = 2;
        } else if (this.uCount > 0) {
          lightBulb = 1;
        }

        var nRenderX = cw - this.tImg(177) - 10;
        var nRenderY = Math.floor(ch / 2) - Math.floor(this.tImg(177) / 2) - hSubtract;

        ctx.drawImage(
          this.imgOracle[this.imgSize][lightBulb],
          nRenderX,
          nRenderY,
          this.tImg(177),
          this.tImg(177));

        if (this.tCount > 1000) {
          this.tCount = 0;
        }
        var tSel = this.tCount % 5;
        this.tCount++;

        ctx.drawImage(
          this.imgT[this.imgSize][tSel],
          nRenderX,
          nRenderY,
          this.tImg(177),
          this.tImg(177));

        this.lCountdown--;
        if (this.lCountdown <= 0) {
          this.lCountdown = 0;
          this.lCounter = 0;
        }

        if (this.lCounter == 3) {
          this.lCountdown = 0;
          this.lCounter = 0;
          this.lAnim = 15;
        }

        if (this.lAnim > 0) {
          var nAnimVar = this.lAnim % 6;
          this.lAnim--;

          var nAdjLightning = this.imgSize == 0 ? 22 : 45;

          if (nAnimVar == 5) {
            $('#lA')[0].play();
          }
          if (this.lAnim == 1) {
            $('#lB')[0].play();
          }

          ctx.drawImage(
            this.imgLightning[this.imgSize][nAnimVar],
            nRenderX + nAdjLightning,
            nRenderY,
            this.tImg(177),
            this.tImg(177));
        }

        //countdown render
        //this.renderText(ctx, 10, 15, "#fafafa", "12px Courier New", "Countdown: " + this.lCountdown + "  - " + this.lCounter);

        if (this.$store.state.oracles.bPriceFeeds == true) {
          this.renderOracles(canvas, ctx, this.$store.state.oracles.priceFeeds, nRenderX, nRenderY);

          //render various text
          var dFont = this.imgSize == 0 ? "16px Arial" : "32px Courier New";
          var dFont2 = this.imgSize == 0 ? "12px Arial" : "24px Courier New";
          var dX = this.imgSize == 0 ? nRenderX + 40 : 715;
          var dY = this.imgSize == 0 ? nRenderY + 48 : 165;
          var dSpacerY = this.imgSize == 0 ? 25 : 48;
          this.renderText(ctx, dX, dY, "#fafafa", dFont, "delphioracle");

          if (this.lastBlock != this.$store.state.oracles.priceFeeds[0].block_num) {
            this.fadeCount = 30;
            this.laserCount = 10;
            this.yCounter = this.yCounter + 50;

            $('#blip1')[0].play();

            this.lCountdown = 100;
            this.lCounter++;

            this.uCount = 10;
            this.oldBlock = this.lastBlock;
            this.lastBlock = this.$store.state.oracles.priceFeeds[0].block_num;
          } else {
            if (this.yCounter > 0) {
              this.yCounter = this.yCounter - 3;
            }
            this.renderText(ctx, dX, dY + dSpacerY, "#fafafa", dFont2, "block #" + this.$store.state.oracles.priceFeeds[0].block_num);
          }

          if (this.uCount > 0) {
            ctx.globalAlpha = (0.9 * (this.uCount / 11));
            this.renderText(ctx, dX + (22 - (this.uCount * 2)), dY + dSpacerY, "#c5b0ff", dFont2, "block #" + this.$store.state.oracles.priceFeeds[0].block_num);
            ctx.globalAlpha = 1.0;
            this.uCount--;
          }

          this.renderText(ctx, dX, dY + dSpacerY, "#fafafa", dFont2, "block #" + this.$store.state.oracles.priceFeeds[0].block_num);
        }
      }

        var fRender = this.renderCanvas;

        setTimeout(function(){
          fRender(true);
        }, 80);
      }
    }
  },
  mounted: function() {
    this.bRenderCanvas = true;

    var fRender = this.renderCanvas;

    gRenderLoopForceStop = true;
    setTimeout(function(){
      console.log("Start new render loop...");
      fRender(false);
    }, 150);

    this.imgOracle[0] = [];
    this.imgOracle[0][0] = document.getElementById("imgOracleSmall");
    this.imgOracle[0][1] = document.getElementById("imgOracleSmallb");
    this.imgOracle[0][2] = document.getElementById("imgOracleSmallc");
    this.imgOracle[1] = [];
    this.imgOracle[1][0] = document.getElementById("imgOracleMed");
    this.imgOracle[1][1] = document.getElementById("imgOracleMedb");
    this.imgOracle[1][2] = document.getElementById("imgOracleMedc");

    this.imgLightning[0] = [];
    this.imgLightning[0][0] = document.getElementById("imgGlowSmall_a");
    this.imgLightning[0][1] = document.getElementById("imgGlowSmall_b");
    this.imgLightning[0][2] = document.getElementById("imgGlowSmall_c");
    this.imgLightning[0][3] = document.getElementById("imgGlowSmall_d");
    this.imgLightning[0][4] = document.getElementById("imgGlowSmall_e");
    this.imgLightning[0][5] = document.getElementById("imgGlowSmall_f");

    this.imgLightning[1] = [];
    this.imgLightning[1][0] = document.getElementById("imgGlowMed_a");
    this.imgLightning[1][1] = document.getElementById("imgGlowMed_b");
    this.imgLightning[1][2] = document.getElementById("imgGlowMed_c");
    this.imgLightning[1][3] = document.getElementById("imgGlowMed_d");
    this.imgLightning[1][4] = document.getElementById("imgGlowMed_e");
    this.imgLightning[1][5] = document.getElementById("imgGlowMed_f");

    this.imgT[0] = [];
    this.imgT[0][0] = document.getElementById("ta");
    this.imgT[0][1] = document.getElementById("tb");
    this.imgT[0][2] = document.getElementById("tc");
    this.imgT[0][3] = document.getElementById("td");
    this.imgT[0][4] = document.getElementById("te");

    this.imgT[1] = [];
    this.imgT[1][0] = document.getElementById("tma");
    this.imgT[1][1] = document.getElementById("tmb");
    this.imgT[1][2] = document.getElementById("tmc");
    this.imgT[1][3] = document.getElementById("tmd");
    this.imgT[1][4] = document.getElementById("tme");

    var canvas = document.getElementById("telosCanvas");

    this.winResize = true;
    this.updateCanvasSize(canvas);

    var fResizeCheck = this.resizeCheck;

    $( window ).resize(function() {
      fResizeCheck();
    });
  },
  destroyed() {
    if (this.client) this.client.disconnect();

    this.client = null;
  }
};
</script>
