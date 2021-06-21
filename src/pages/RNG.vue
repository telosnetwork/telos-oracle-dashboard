<template>

  <q-page class="column justify-center items-center">

    
    <div v-if="isAuthenticated">
      <p> </p>

      <canvas onmousemove='' onclick='' id='trailCanvas' style='border: none; background-color: #111; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block;'>
      </canvas>

      <img id="img_01" alt="" src="~assets/rng/a_01.png" width="96" height="96" hidden/>
      <img id="img_02" alt="" src="~assets/rng/a_02.png" width="96" height="96" hidden/>
      <img id="img_03" alt="" src="~assets/rng/a_03.png" width="96" height="96" hidden/>

      <img id="img_cloud" alt="" src="~assets/rng/a_cloud.png" width="63" height="33" hidden/>
      <img id="img_journey" alt="" src="~assets/rng/a_journey.png" width="21" height="141" hidden/>
      <img id="img_marker" alt="" src="~assets/rng/a_marker.png" width="12" height="12" hidden/>
      <img id="img_mountain" alt="" src="~assets/rng/a_mountain.png" width="78" height="39" hidden/>
      <img id="img_ox" alt="" src="~assets/rng/a_ox.png" width="153" height="84" hidden/>
      <img id="img_text_box_1" alt="" src="~assets/rng/a_text_box_1.png" width="192" height="84" hidden/>
      <img id="img_text_box_2" alt="" src="~assets/rng/a_text_box_2.png" width="102" height="24" hidden/>
      <img id="img_tree" alt="" src="~assets/rng/a_tree.png" width="60" height="123" hidden/>
      <img id="img_wheel_1" alt="" src="~assets/rng/a_wheel_1.png" width="81" height="42" hidden/>
      <img id="img_wheel_2" alt="" src="~assets/rng/a_wheel_2.png" width="81" height="42" hidden/>

      <p>&nbsp;</p>

      <center>
      <q-btn size="xl" label="Travel" color="primary" @click="send" />
      </center>

      <q-dialog v-model="showTransaction" confirm>
        <q-card >
          <q-card-section class="row">
            <q-avatar icon="arrow_forward" color="primary" />
            <span class="q-ml-sm">
              Transaction sent, click to view in block explorer.
            </span>
            <q-item
              clickable
              tag="a"
              target="_blank"
              href="`${explorerUrl}/transaction/${transaction}`"
              class="q-ml-sm"
              > {{ transaction }} </q-item>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Ok" color="primary" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      
      <p>&nbsp;</p>
    </div>
    <div v-else>Please login to play!</div>
  </q-page>

</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      bRenderCanvas: false,
      imgTileMap: [],
      tileMap: [[0,0,0,0],[1,1,1,1],[2,2,2,2]],
      imgComp: [],
      compMap: [0,2,0,0],
      counter: 0, //counts from 0 up to 95
      winResize: false,
      imgSize: 0,
      to: null,
      amount: null,
      memo: null,
      showTransaction: null,
      transaction: null,
      traveling: false,
      lastBlock: null,
      lastRNG: null,
      travelPoint: 0,
      textCounter: 0,
      textDisplayMain: "",
      gameState: 0,
      stats: {wheel: 3, axle: 1, people: 4, food: 150},
      lastAccountName: "",
    };
  },
  computed: {
    ...mapGetters("account", ["isAuthenticated", "accountName"])
  },
  methods: {
    ...mapActions("account", ["accountExists"]),
    resizeCheck() {
      var canvas = document.getElementById("trailCanvas");
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

        this.imgSize = 0;

        if(ww > 1000) {
          this.imgSize = 1;
        }

        var setWidth = this.imgSize == 0 ? 288 : 576;
        var setHeight = this.imgSize == 0 ? 288 : 576;

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
    async send() {

      if (!(await this.accountExists(this.$store.state.account.accountName))) {
        this.$q.notify({
          type: "negative",
          message: `Account ${this.$store.state.account.accountName} does not exist`
        });
        return;
      }

      console.log("Traveling...");

      this.traveling = true;

      if(this.gameState >= 99){
        this.gameState = 1;
        this.stats.wheel = 3;
        this.stats.axle = 1;
        this.stats.people = 4;
        this.stats.food = 150;
      }

      const actions = [
        {
          account: process.env.ORACLE_CONSUMER,
          name: "requestrand",
          data: {
            seed: 100,
            caller: this.accountName.toLowerCase(),
            min: 1,
            max: 1000
          }
        }
      ];

      const transaction = await this.$store.$api.signTransaction(actions);
      if (transaction) {
        this.showTransaction = true;
        this.transaction = transaction.transactionId;
      }
    },
    loadImages() {

      this.imgTileMap[0] = [];
      this.imgTileMap[0][0] = document.getElementById("img_01");
      this.imgTileMap[0][1] = document.getElementById("img_02");
      this.imgTileMap[0][2] = document.getElementById("img_03");

      this.imgTileMap[1] = [];
      this.imgTileMap[1][0] = document.getElementById("img_01");
      this.imgTileMap[1][1] = document.getElementById("img_02");
      this.imgTileMap[1][2] = document.getElementById("img_03");

      this.imgComp["cloud"] = document.getElementById("img_cloud");
      this.imgComp["journey"] = document.getElementById("img_journey");
      this.imgComp["marker"] = document.getElementById("img_marker");
      this.imgComp["mountain"] = document.getElementById("img_mountain");
      this.imgComp["text_box_1"] = document.getElementById("img_text_box_1");
      this.imgComp["text_box_2"] = document.getElementById("img_text_box_2");
      this.imgComp["tree"] = document.getElementById("img_tree");
      this.imgComp["ox"] = document.getElementById("img_ox");
      this.imgComp["wheel_1"] = document.getElementById("img_wheel_1");
      this.imgComp["wheel_2"] = document.getElementById("img_wheel_2");

    },
    setTraveling(status) {
      this.traveling = status;
    },
    drawTextMain(ctx, sText) {

      ctx.fillStyle = "white";

      if(this.imgSize == 1)
      { ctx.font = "18px Tahoma"; }
      else
      { ctx.font = "10px Tahoma"; }

      ctx.drawImage(
        this.imgComp["text_box_1"],
        20*(this.imgSize+1),
        190*(this.imgSize+1),
        this.imgComp["text_box_1"].width*(this.imgSize+1),
        this.imgComp["text_box_1"].height*(this.imgSize+1)
      );

      var nRows = Math.ceil(sText.length / 24);
      var xText = "";
      for(var ix = 0; ix < nRows; ix++) {
        var count = 0;
        for(var iy = (ix*6); (iy < sText.split(" ").length) && (count < 6); iy++) {
          xText = xText + sText.split(" ")[iy] + " ";
          count++;
        }

        ctx.fillText(xText,(29)*(this.imgSize+1),((208)*(this.imgSize+1))+((ix*16)*(this.imgSize+1)) );
      
        xText = "";
      }
    },
    renderStats(ctx) {
      ctx.drawImage(
        this.imgComp["text_box_2"],
        180*(this.imgSize+1),
        4*(this.imgSize+1),
        this.imgComp["text_box_2"].width*(this.imgSize+1),
        this.imgComp["text_box_2"].height*(this.imgSize+1)
      );

      ctx.fillStyle = "white";

      if(this.imgSize == 1)
      { ctx.font = "18px Arial Black"; }
      else
      { ctx.font = "9px Arial Black"; }

      ctx.fillText("W:"+this.stats.wheel+" A:"+this.stats.axle+" P:"+this.stats.people+" F:"+this.stats.food,189*(this.imgSize+1), 19*(this.imgSize+1));
      
    },
    drawJourney(ctx, nPoint) {

      var nAdd = 0;

      if(nPoint >= 7) {
        nAdd = 12;
      }

      ctx.drawImage(
        this.imgComp["journey"],
        260*(this.imgSize+1),
        140*(this.imgSize+1),
        this.imgComp["journey"].width*(this.imgSize+1),
        this.imgComp["journey"].height*(this.imgSize+1)
      );

      ctx.drawImage(
        this.imgComp["marker"],
        266*(this.imgSize+1),
        ((263)*(this.imgSize+1))-(((nPoint * 9)+nAdd)*(this.imgSize+1)),
        this.imgComp["marker"].width*(this.imgSize+1),
        this.imgComp["marker"].height*(this.imgSize+1)
      );
    },
    renderCanvas(checkMounted) {

      if(checkMounted){
        if(gRenderLoopForceStop == true)
        { console.log("ENDED old Render Loop"); gRenderLoopForceStop = false; return; }
      } else {
        gRenderLoopForceStop = false;
      }

      var gameStateUpdate = false;

      var canvas = document.getElementById("trailCanvas");

      if( (this.bRenderCanvas) && (canvas !== null) && (this.$store.state.account.accountName !== "") ) {

        if(this.lastAccountName !== this.$store.state.account.accountName) {
          this.lastAccountName = this.$store.state.account.accountName;

          this.loadImages();
          this.winResize = true;
          this.updateCanvasSize(canvas);
          
          var fRenderB = this.renderCanvas;

          setTimeout(function(){
              fRenderB(true);
          }, 150);

          return;
        }

        var cw = $(canvas).width();
        var ch = $(canvas).height();
        var i1 = 0;
        var i2 = 0;

        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        /* RENDER COUNTER 0 to 95 */

        if(this.traveling){
          this.counter++;
        }

        if(this.counter == 96) {
          this.counter = 0;

          //transform tile mapping
          for(i2 = this.tileMap.length-1; i2 >= 0; i2--) {
            for(i1 = this.tileMap[i2].length-1; i1 >= 0; i1--) {
              
              if(i1 == 0) { 
                this.tileMap[i2][i1] = i2;
              } else {
              this.tileMap[i2][i1] = this.tileMap[i2][i1-1];
              }
            }
          }

          for(i1 = this.compMap.length-1; i1 >= 0 ; i1--) {
            if(i1 == 0) { 
              this.compMap[i1] = Math.floor(Math.random() * 4);
            } else {
              this.compMap[i1] = this.compMap[i1-1];
            }
          }
        }

        var wobble = 0;
        
        //Ox Wagon Wobble Code
        if((this.counter % 42) < 16) {
          wobble = 0;
        } else if ((this.counter % 42) < 20) {
          wobble = 3;
        } else if ((this.counter % 42) < 26) {
          wobble = 0;
        } else if ((this.counter % 42) < 28) {
          wobble = 1;
        } else if ((this.counter % 42) < 29) {
          wobble = 0;
        } else if ((this.counter % 42) < 30) {
          wobble = 1;
        } else if ((this.counter % 42) < 31) {
          wobble = 0;
        } else if ((this.counter % 42) < 34) {
          wobble = 2;
        }

        /* RENDER TILES */
        for(i2 = 0; i2 < this.tileMap.length; i2++) {
          for(i1 = 0; i1 < this.tileMap[i2].length; i1++) {

              ctx.drawImage(
              this.imgTileMap[0][this.tileMap[i2][i1]],
              ((this.counter-96)+i1*96)*(this.imgSize+1),
              i2*96*(this.imgSize+1),
              96*(this.imgSize+1),
              96*(this.imgSize+1)
              );
          }
        }

        /* RENDER BG COMPONENTS */
        var imgCompDraw = null;
        var height = 0;
  
        for(i1 = 0; i1 < this.compMap.length; i1++) {
          switch (this.compMap[i1]) {
            case 0:
              imgCompDraw = null;
              break;
            case 1:
              imgCompDraw = this.imgComp["cloud"];
              height = 15 *(this.imgSize+1);
              break;
            case 2:
              imgCompDraw = this.imgComp["tree"];
              height = 25 *(this.imgSize+1);
              break;
            case 3:
              imgCompDraw = this.imgComp["mountain"];
              height = (96 - this.imgComp["mountain"].height ) *(this.imgSize+1);
              break;
          }

          if(imgCompDraw !== null) {
            ctx.drawImage(
              imgCompDraw,
              ((this.counter-96)+i1*96)*(this.imgSize+1),
              height,
              imgCompDraw.width*(this.imgSize+1),
              imgCompDraw.height*(this.imgSize+1)
            );
          }
        }

        /* RENDER OX WAGON */
        ctx.drawImage(
          this.imgComp["ox"],
          72*(this.imgSize+1),
          (115+wobble)*(this.imgSize+1),
          this.imgComp["ox"].width*(this.imgSize+1),
          this.imgComp["ox"].height*(this.imgSize+1)
        );

        if((this.counter % 20) < 10) {
          imgCompDraw = this.imgComp["wheel_1"];
        } else {
          imgCompDraw = this.imgComp["wheel_2"];
        }

        ctx.drawImage(
          imgCompDraw,
          125*(this.imgSize+1),
          (162+wobble)*(this.imgSize+1),
          this.imgComp["wheel_1"].width*(this.imgSize+1),
          this.imgComp["wheel_1"].height*(this.imgSize+1)
        );

        /* DRAW JOURNEY */
        this.drawJourney(ctx, this.travelPoint);

        /* RNG TEXT & RNG UPDATE*/
        if(this.$store.state.oracles.bRNGFeeds == true) {

          if(this.lastBlock === null) {
            for( i1 = 0; i1 < this.$store.state.oracles.rngFeeds.length; i1++ ) {
              if(this.$store.state.oracles.rngFeeds[i1].act.data.caller == this.$store.state.account.accountName) {
                this.lastBlock = this.$store.state.oracles.rngFeeds[i1].block_num;
                this.lastRNG = this.$store.state.oracles.rngFeeds[i1].act.data.number;
              }
            }
          } else {
            if(this.lastBlock != this.$store.state.oracles.rngFeeds[0].block_num) {

              this.lastBlock = this.$store.state.oracles.rngFeeds[0].block_num;

              for( i1 = 0; i1 < this.$store.state.oracles.rngFeeds.length; i1++ ) {
                if(this.$store.state.oracles.rngFeeds[i1].act.data.caller == this.$store.state.account.accountName) {
                  //new update of RNG number
                  this.lastRNG = this.$store.state.oracles.rngFeeds[i1].act.data.number;
                  
                  if(this.gameState == 0) {
                    this.gameState = 1;
                  }
                  else {
                    gameStateUpdate = true;
                    this.gameState = 2;
                    this.traveling = false;
                  }
                  break;
                }
              }

            }
          }

          ctx.fillStyle = "white";
          ctx.font = "20px Arial";
          ctx.fillText("Last RNG: " + this.lastRNG,20,20);
        }

        /*UPDATE GAME STATE*/
        if(gameStateUpdate) {
          this.textCounter = 0;
          var nDays = 0;
          var nFood = 0;

          //update food consumption
          this.stats.food = this.stats.food - (this.stats.people * 2);

          
          if( (this.lastRNG % 13) == 0 ){
            this.textDisplayMain = "Your wagon breaks a wheel!";
            this.stats.wheel--;
          }
          else if( (this.lastRNG % 33) == 0 ){
            this.textDisplayMain = "Your wagon breaks an axle!";
            this.stats.axle--;
          }
          else if( (this.lastRNG % 16) == 0 ){
            this.textDisplayMain = "A member of your party dies from ";
            var nRand = Math.floor(Math.random() * 6);
            if(nRand == 0) { this.textDisplayMain = this.textDisplayMain + "dysentery."; }
            if(nRand == 1) { this.textDisplayMain = this.textDisplayMain + "wolves."; }
            if(nRand == 2) { this.textDisplayMain = this.textDisplayMain + "aliens."; }
            if(nRand == 3) { this.textDisplayMain = this.textDisplayMain + "buffalo."; }
            if(nRand == 4) { this.textDisplayMain = this.textDisplayMain + "cholera."; }
            if(nRand == 5) { this.textDisplayMain = this.textDisplayMain + "being born in the 1800's."; }

            this.stats.people--;
          }
          else if( (this.lastRNG % 5) == 0 ){
            nDays = Math.ceil(((this.lastRNG % 100) / 10)) + 1;
            nFood = nDays * this.stats.people * 2;
            this.textDisplayMain = "You lose " + nDays + " days of travel and consume " + nFood + " lb of food.";
            this.stats.food = this.stats.food - nFood;
          }
          else if( (this.lastRNG % 6) == 0 ){
            nFood = ((this.lastRNG % 20)+1) * 2;
            this.textDisplayMain = "You forage " + nFood + " lb of food while making progress!";
            this.stats.food = this.stats.food + nFood;
            this.travelPoint++;
          }
          else if( (this.lastRNG % 27) == 0 ){
            this.textDisplayMain = "You trade with locals for an additional wagon wheel.";
            this.stats.wheel++;
          }
          else if( (this.lastRNG % 2) == 0 ){
            this.textDisplayMain = "You progress along your journey on the Telos Trail!";
            this.travelPoint++;
          } else {
            this.textDisplayMain = "You are slowed in travel and make no progress.";
          }

          //game state checks
          if(this.stats.food <= 0 ){
            this.textDisplayMain = this.textDisplayMain + " Your party starves to death on the journey!  GAME OVER";
            this.travelPoint = 0;
            this.gameState = 101;
          } else if (this.stats.people <= 0) {
            this.textDisplayMain = this.textDisplayMain + " Everyone died!  GAME OVER";
            this.travelPoint = 0;
            this.gameState = 101;
          } else if (this.stats.wheel <= 0) {
            this.textDisplayMain = this.textDisplayMain + " Unable to travel!  GAME OVER";
            this.travelPoint = 0;
            this.gameState = 101;
          } else if (this.stats.axle <= 0) {
            this.textDisplayMain = this.textDisplayMain + " Unable to travel!  GAME OVER";
            this.travelPoint = 0;
            this.gameState = 101;
          } else if (this.travelPoint == 11) {
            this.textDisplayMain = this.textDisplayMain + " Journey Finished!  YOU WIN";
            this.gameState = 99;
          }
        }

        /*STATS RENDERING*/
        this.renderStats(ctx);

        /* TEXT BOX RENDERING */
        if(this.textCounter < 10) { this.textCounter++; }

        var nText = Math.floor(this.textDisplayMain.length / 10); //characters per chunk
        var sText = "";
        if((this.textCounter < 10) && ((nText * this.textCounter) < this.textDisplayMain.length) ) {
          sText = this.textDisplayMain.substring(0,(nText) * this.textCounter);
        }
        else { sText = this.textDisplayMain; }

        if((this.gameState > 1) && (this.traveling == false)) {
          this.drawTextMain(ctx, sText);
        }
      }



      var fRender = this.renderCanvas;

      setTimeout(function(){
          fRender(true);
      }, 80);
    }
  },
  mounted: function () {

    /* COMPONENT VAR STATES */
    this.winResize = true;
    this.bRenderCanvas = true;

    /* FUNCTION VARS TO PASS INTO DOCUMENT READY */ 
    var fUpdateCanvasSize = this.updateCanvasSize;
    var fResizeCheck = this.resizeCheck;
    var fRender = this.renderCanvas;
    var fLoadImages = this.loadImages;
    
    this.lastAccountName = this.$store.state.account.accountName;

    $( document ).ready(function() {

      /* CANVAS RESIZE CODE */
      var canvas = document.getElementById("trailCanvas");

      fUpdateCanvasSize(canvas);

      $( window ).resize(function() {
        fResizeCheck();
      });

      /* IMAGE LOADS */
      fLoadImages();

      /* INI RENDERING LOOP */
      gRenderLoopForceStop = true;
      setTimeout(function(){
        console.log("Start new render loop...");
        fRender(false);
      }, 250);

    });
  }
};
</script>
