//variables globales
var nivel = 1;
var player = ""; 
var player0 = ""; //jugador 1 left
var player2 = ""; 
var player3 = ""; //jugador 2 left
var stars = ""; 
var bombs = "";
var spikes = "";
var multijugador = 1;
var scoretext = "";
var scoretext2 = "";
var musicstart=true;
var goleft1 = false;
var goleft2 = false;  
var goright1 = false; 
var goright2 = false; 
var goup1 = false; 
var goup2 = false; 

var goleft3 = false;
var goright3 = false; 
var goup3 = false; 

var nombrenivel = 'Easy'; 
var arraynombre = ['Easy','Medium','Hard'];

var jugadores = "1 Player"; 
var arrayjugador = ['1 Player','2 Players'];  


class MainScene extends Phaser.Scene{
    constructor(){
        super('gameScene');
    }
    preload(){
      //es la carga de los recursos y solo se ejecuta una vez
      this.load.baseURL='./';
      this.load.image('fondo','./img/escenario.png');
      this.load.image('platform','./img/plataforma.png');
      this.load.image('ground','./img/ground.png');
      this.load.image('star','./img/cookie.png');
      this.load.image('bomb','./img/bomb.png'); 
      this.load.image('pua','./img/spike.png');
      this.load.spritesheet('jugador','./img/kater.png',{frameWidth:34.3,frameWeight:48});
      this.load.spritesheet('jugador0','./img/katerleft.png',{frameWidth:34,frameWeight:48});
      this.load.spritesheet('jugador2','./img/Rone.png',{frameWidth:34,frameWeight:48}); 
      this.load.spritesheet('jugador3','./img/Roneleft.png',{frameWidth:34,frameWeight:48}); 

      //SONIDOS
      this.load.audio('musica_fondo','./img/JUMKA.mp3');
      this.load.audio('getcookie','./img/pickup.mp3');
      this.load.audio('crash','./img/impact.mp3');
      //this.load.audio('gameover','./img/over.mp3');

      //CELLPHONE
      this.load.image('control1','./img/arrows.png');
      this.load.image('control2','./img/rightleft.png');
      this.load.image('control3','./img/jumpbutton.png');
      this.load.image('control4','./img/movekeys.png');
       
    }
    create(){
       //esto solo se ejecuta una vez y es la parte logica y armado
       if(musicstart){
        musicstart=false; 
        const music = this.sound.add('musica_fondo'); 
        music.play({
            volume:.3,
            loop:true
        });
       }
      this.add.image(400,250,'fondo').setScale(2);
      var platform = this.physics.add.staticGroup(); //Crear una variable o grupo de elementos estàticos 
      platform.create(200,520,'ground');
      platform.create(500,520,'ground');
      platform.create(700,520,'ground'); 
      //darle un lugar, cordenada en X(180) y en Y(530) creamos los niveles 

      if(nivel==1){
        platform.create(55,290,'platform'); //stair 1 esquina
        platform.create(150,370,'platform'); //stair 2
        platform.create(300,450,'platform'); //stair 3
        platform.create(215,230,'platform'); //stair 4
        platform.create(380,160,'platform'); //stair 5
        platform.create(490,120,'platform'); //stair 6
        platform.create(620,80,'platform'); //stair 7
        platform.create(710,80,'platform'); //stair 8
        platform.create(800,80,'platform'); //stair 9

      }
      if(nivel==2){
        platform.create(30,80,'platform'); //1
        platform.create(140,150,'platform'); //2
        platform.create(260,240,'platform'); //3
        platform.create(250,440,'platform'); //5 down start
        platform.create(412,390,'platform'); //6
        platform.create(578,310,'platform'); //7
        platform.create(495,230,'platform'); //8
      }
     if(nivel==3){
        platform.create(170,370,'platform'); //1
        platform.create(270,370,'platform'); //2
        platform.create(620,370,'platform'); //3
        platform.create(730,370,'platform'); //4
        platform.create(295,290,'platform'); //6
        platform.create(450,220,'platform'); //7
        platform.create(575,140,'platform'); //8
        platform.create(380,440,'platform'); //start
        platform.create(710,210,'platform');
        platform.create(50,240,'platform');
     }
     //-----------------------END niveles-----------------------

//PERSONAJE 1 
      player = this.physics.add.sprite(450,420,'jugador');
      player.setCollideWorldBounds(true); //estas entregando una colision entre el mundo y el personaje 
      player.setBounce(.2);
      this.physics.add.collider(player,platform); //agregar un colisionador a todo lo que compone el fondo
      player.score =0;
      
    //TEXTO
      scoretext = this.add.text(10,1, 'score:0',{fontSize:'32px',fill:'#FFFB00'}); 
//END PERSONAJE 1 MONTAJE

//PERSONAJE 2-
       if (multijugador==2){
        player2 = this.physics.add.sprite(440,420,'jugador2');
      player2.setCollideWorldBounds(true); //estas entregando una colision entre el mundo y el personaje 
      player2.setBounce(.2);
      this.physics.add.collider(player2,platform); //agregar un colisionador a todo lo que compone el fondo
      player2.score =0;

    //TEXTO 2
      scoretext2 = this.add.text(655,1, 'score:0',{fontSize:'32px',fill:'#00EAFF'});
      this.gameTime=60

      this.timetext=this.add.text(370,3,this.gameTime,{fontSize: '30px',color:'white'});
      this.refreshTime(); 
    }
//END PERSONAJE 2 MONTAJE

//ESTRELLAS
    //Montamos estrellas o items
      
      stars = this.physics.add.group({
        key: 'star',
        repeat: 15, 
        setXY:{x:15, y:0,stepX:40}
      }); 

    //PADRES E HIJOS
      this.physics.add.collider(stars,platform);
      stars.children.iterate(function (child){
        child.setBounce(0.3); //las estrellas rebotan
      });
//END ESTRELLAS
       
//RECOLECCIÓN
      this.physics.add.overlap(player,stars,collectStar,null,this); 
//END RECOLECCION

//BOMBA
      //metodo de bombas
      bombs = this.physics.add.group();    
      this.physics.add.collider(bombs,platform); 
      this.physics.add.collider(player,bombs,hitBomb,null,this);
//END BOMBA

//HITBOMB
     function hitBomb (elemento,bomb){
        if(multijugador==1){
            this.physics.pause(); //cuando la bomba choque con el jugador va a parar todas las fisicas pero no las animaciones
               //STARS MUSIC
               const music = this.sound.add('crash'); 
               music.play({
                 volume:.3,
                 loop:false
                  });
                 //FIN STARS MUSIC
            player.setTint(0xff0000);
            player.anims.play('front'); 
           
            this.time.addEvent({
                delay:2000,
                loop:false,
                callback:()=>{
                    this.scene.start("endScene");
                }

            });
        }else{ 
            if(player.score -10 <=0){
                player.score = 0;
            }else{
                player.score-=10; //restar vida o puntos cada que la bomba colisione, solo funciona en multijugador
            }
            scoretext.setText('Score: '+player.score); 

        }
     }
//END HITBOM

//SPIKES
    //montamos SPIKES
    var spikes = this.physics.add.group();
    if(nivel==2){  
    spikes.create(230,410,'pua').setScale(.10);
    spikes.create(500,490,'pua').setScale(.10);
    spikes.create(590,490,'pua').setScale(.10);
    spikes.create(760,490,'pua').setScale(.10);
    spikes.create(120,490,'pua').setScale(.10);
    spikes.create(30,490,'pua').setScale(.10);
    }
    if(nivel==3){  
    spikes.create(230,490,'pua').setScale(.10);
    spikes.create(500,490,'pua').setScale(.10);
    spikes.create(590,490,'pua').setScale(.10);
    spikes.create(670,490,'pua').setScale(.10);
    spikes.create(760,490,'pua').setScale(.10);
    spikes.create(120,490,'pua').setScale(.10);
    spikes.create(30,490,'pua').setScale(.10);
    //up
    spikes.create(620,340,'pua').setScale(.10);
    spikes.create(730,340,'pua').setScale(.10);
    spikes.create(710,180,'pua').setScale(.10);
    }
    //END Montaje 

    //Añadir Colliders
     this.physics.add.collider(spikes,platform); 
     this.physics.add.collider(player,spikes,hitSpike,null,this);
    
    //Función hitspike
    function hitSpike (elemento,spike){
        if(player){
            this.physics.pause(); //cuando la bomba choque con el jugador va a parar todas las fisicas pero no las animaciones
            //STARS MUSIC
               const music = this.sound.add('crash'); 
               music.play({
                 volume:.3,
                 loop:false
                  });
            //FIN STARS MUSIC
            player.setTint(0xff0000);
            player.anims.play('front'); 
           
            this.time.addEvent({
                delay:2000,
                loop:false,
                callback:()=>{
                    this.scene.start("endScene");
                }

            });
     }
    }

//END SPIKES

//CONSUMIR ESTRELLAS
      function collectStar(player,star){
        player.score +=10; 
        scoretext.setText('score:'+player.score); 
        colliderStar(star,this); 

    //STARS MUSIC
      const music = this.sound.add('getcookie'); 
      music.play({
          volume:.3,
          loop:false
      });
    //FIN STARS MUSIC
      }
//END CONSUMIR ESTRELLAS 


//JUGADOR 2 
    //Recolecion jugador2
      if (multijugador==2){
        this.physics.add.overlap(player2,stars,collectStar2,null,this); 
    //END metodo jugador2

    //consumir estrellas personaje2
        function collectStar2(player2,star){
        player2.score +=10; 
        scoretext2.setText('score:'+player2.score); 
        colliderStar(star,this);     
            
    //STARS MUSIC
      const music = this.sound.add('getcookie'); 
      music.play({
          volume:.3,
          loop:false
      });
    //FIN STARS MUSIC
        }
        
        this.physics.add.collider(player2,bombs,hitBomb2,null,this);
        this.physics.add.collider(player2,spikes,hitSpike2,null,this); //colision de bomba a jugador 2 
    
    //END recolecion jugador 2

      }
    //funcion hitbomb2
         function hitBomb2(elemento,bomb){
            if(player2.score -10 <=0){
                player2.score=0
            }else{ 
                player2.score-=10;
         }
         scoretext2.setText('Score: '+player2.score); 
    } 
    //HITBOM 2 END 

    //SPIKES 2
    function hitSpike2 (elemento,spike){ 
    if(player2){
        this.physics.pause();
        //STARS MUSIC
           const music = this.sound.add('crash'); 
           music.play({
             volume:.3,
             loop:false
              });
        //FIN STARS MUSIC
        player2.setTint(0xff0000);
        player2.anims.play('front'); 
       
        this.time.addEvent({
            delay:2000,
            loop:false,
            callback:()=>{
                this.scene.start("endScene");
            }

        });
    }
}
    //SPIKES 2 END

//END JUGADOR 2


//COLLIDER GENERAL
      function colliderStar (star){ 
        star.disableBody(true,true); 
  
        if(stars.countActive(true)===0){ 
        var bomb = bombs.create(Phaser.Math.Between(0,800),16,'bomb');
        bomb.setCollideWorldBounds(true); 
        bomb.setBounce(1); 
        bomb.setVelocity(Phaser.Math.Between(-400*nivel,400*nivel),20);
          stars.children.iterate(function(child){
          child.enableBody(true,child.x,0,true,true)
       }); 
    }
}
//END COLLIDER GENERAL


//ANIMACIONES PERSONAJE 1 
    this.anims.create({
        key:'left', 
        frames:this.anims.generateFrameNumbers('jugador0',{start:0,end:6}),
        frameRate:8, 
        repeat:-1    
    }); 
    this.anims.create({
        key:'right', 
        frames:this.anims.generateFrameNumbers('jugador',{start:0,end:6}),
        frameRate:8, 
        repeat:-1    
    }); 
    this.anims.create({
        key:'front', 
        frames:this.anims.generateFrameNumbers('jugador',{start:0,end:0}),
        frameRate:8, 
        repeat:-1    
    }); 
//END ANIMACIONES PERSONAJE 1

//ANIMACIONES PERSONAJE 2
    this.anims.create({
        key:'W', 
        frames:this.anims.generateFrameNumbers('jugador2',{start:0,end:0}),
        frameRate:8, 
        repeat:-1    
    });
    this.anims.create({
        key:'A', 
        frames:this.anims.generateFrameNumbers('jugador3',{start:0,end:6}),
        frameRate:8, 
        repeat:-1    
    }); 
    this.anims.create({
        key:'D', 
        frames:this.anims.generateFrameNumbers('jugador2',{start:0,end:6}),
        frameRate:8, 
        repeat:-1    
    }); 
//END ANIMACIONES PERSONAJE 2 

//CONTROLES DE CELULAR
//BOTONES JUGADOR1
    if(screen.width <=900){
        if (multijugador==1){
        this.add.image(130,450,'control2').setScale(0.9);
        this.add.image(740,450,'control3').setScale(0.9);
        
        //zona de izquierda jugador 1 
        const leftp1=this.add.zone(10,400,100,90); //15 desplazamiento en X, 420 en Y, 50 es altura y el otro 50, la anchura
        leftp1.setOrigin(0); 
        leftp1.setInteractive();
        leftp1.on('pointerdown',()=>setleft1(true)); 
        leftp1.on('pointerup',()=>setleft1(false)); 
        leftp1.on('pointerout',()=>setleft1(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(leftp1);
        
        //Zona derecha jugador 1 
        const rightp1=this.add.zone(145,400,100,90);
        rightp1.setOrigin(0); 
        rightp1.setInteractive();
        rightp1.on('pointerdown',()=>setright1(true)); 
        rightp1.on('pointerup',()=>setright1(false)); 
        rightp1.on('pointerout',()=>setright1(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(rightp1);

        //Zona de salto jugador 1 
        const up1=this.add.zone(690,400,99,90);
        up1.setOrigin(0); 
        up1.setInteractive();
        up1.on('pointerdown',()=>setup1(true)); 
        up1.on('pointerup',()=>setup1(false)); 
        up1.on('pointerout',()=>setup1(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(up1);

        function setleft1(status){
            goleft1=status;
        }
        function setright1(status){
            goright1=status;
        }
        function setup1(status){
            goup1=status;
        }
    }
    //END BOTONAES JUGADOR 1

    //JUGADOR 2 BOTONES 

        if(multijugador==2){ 

        this.add.image(130,450,'control1').setScale(0.7);
        this.add.image(680,450,'control4').setScale(0.7);
        
        //zona de izquierda jugador 2
        const leftp2=this.add.zone(565,410,70,70);
        leftp2.setOrigin(0); 
        leftp2.setInteractive();
        leftp2.on('pointerdown',()=>setleft2(true)); 
        leftp2.on('pointerup',()=>setleft2(false)); 
        leftp2.on('pointerout',()=>setleft2(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(leftp2);
        
        //Zona derecha jugador 2
        const rightp2=this.add.zone(725,410,70,70);
        rightp2.setOrigin(0); 
        rightp2.setInteractive();
        rightp2.on('pointerdown',()=>setright2(true)); 
        rightp2.on('pointerup',()=>setright2(false)); 
        rightp2.on('pointerout',()=>setright2(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(rightp2);

        //Zona de salto jugador 2 
        const up2=this.add.zone(645,370,70,70);
        up2.setOrigin(0); 
        up2.setInteractive();
        up2.on('pointerdown',()=>setup2(true)); 
        up2.on('pointerup',()=>setup2(false)); 
        up2.on('pointerout',()=>setup2(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(up2);



//BOTONES JUGADOR 1 EN MULTIJUGADOR
        //zona de izquierda jugador 1 
        const leftp3=this.add.zone(10,410,75,70);
        leftp3.setOrigin(0); 
        leftp3.setInteractive();
        leftp3.on('pointerdown',()=>setleft3(true)); 
        leftp3.on('pointerup',()=>setleft3(false)); 
        leftp3.on('pointerout',()=>setleft3(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(leftp3);
        
        //Zona derecha jugador 1 
        const rightp3=this.add.zone(175,410,75,70);
        rightp3.setOrigin(0); 
        rightp3.setInteractive();
        rightp3.on('pointerdown',()=>setright3(true)); 
        rightp3.on('pointerup',()=>setright3(false)); 
        rightp3.on('pointerout',()=>setright3(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(rightp3);

        //Zona de salto jugador 1 
        const up3=this.add.zone(90,370,78,75);
        up3.setOrigin(0); 
        up3.setInteractive();
        up3.on('pointerdown',()=>setup3(true)); 
        up3.on('pointerup',()=>setup3(false)); 
        up3.on('pointerout',()=>setup3(false)); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(up3);
        
     
    
        function setleft2(status){
            goleft2=status;
        }
        function setright2(status){
            goright2=status;
        }
        function setup2(status){
            goup2=status;
        }

        function setleft3(status){
            goleft3=status;
        }
        function setright3(status){
            goright3=status;
        }
        function setup3(status){
            goup3=status;
        }
     }  
    } 
//FIN BOTONES JUGADOR 2    
//FIN CONROLES DE CELULAR 
    }


//TEMPORIZADOR
     refreshTime(){
        this.gameTime--; 
        this.timetext.setText(this.gameTime); 
        if(this.gameTime===0){
            this.physics.pause();
            player.setTint(0xff0000); 
            player2.setTint(0xff000); 
          
            this.time.addEvent({
                delay:2000,
                loop:false,

                callback:()=>{
                    this.scene.start('endScene'); 
                }
            });
        }else{
            this.time.delayedCall(1000,this.refreshTime,[],this); 
        }
     }

//END TEMPORIZADOR 
    
    update(){

 //MOVIMIENTOS DE PERSONAJE
    //PERSONAJE 1
        var cursor = this.input.keyboard.createCursorKeys(); //entrada de datos 
        if(cursor.left.isDown || goleft1 || goleft3){
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }else if(cursor.right.isDown || goright1 || goright3){
            player.setVelocityX(160);
            player.anims.play('right', true);
        }else{
            player.setVelocityX(0);
            player.anims.play('front', true);
        }
        if((cursor.up.isDown || goup1 || goup3) && player.body.touching.down){
            player.setVelocityY(-230);
            }
//END MOVIMIENTOS PERSONAJE 1

        //MOVIMIENTOS PERSONAJE 2 
        if (multijugador== 2){
            var keyup =this.input.keyboard.addKey('W'); 
            var player2up = keyup.isDown;

            var keyleft =this.input.keyboard.addKey('A'); 
            var player2left = keyleft.isDown; 

            var keyright =this.input.keyboard.addKey('D');
            var player2right = keyright.isDown; 

            if(player2left || goleft2){
                player2.setVelocityX(-160); 
                player2.anims.play('A',true); 
            }else if(player2right || goright2){
                player2.setVelocityX(160); 
                player2.anims.play('D',true); 
            }else{
                player2.setVelocityX(0);
                player2.anims.play('W', true);
            }
            if((player2up || goup2) && player2.body.touching.down){
                player2.setVelocityY(-230); 
            }
        }
        //END MOVIMIENTOS PERSONAJE 2 

       }
}
//END MOVIMIENTOS DE PERSONAJE 


//ESCENAS
class Level extends Phaser.Scene{
    constructor(){
        super('levelScene');
    }
    preload(){
        this.load.image('fondo','./img/escenario.png');
        this.load.image('name','./img/JumKa.png');
        this.load.image('Cat','./img/character.png');
        this.load.image('mode','./img/mode.png'); 
   
    }
    create(){
        this.add.image(400,250,'fondo').setScale(2);
        this.add.image(400,50,'name');
        this.add.image(180,450,'Cat').setScale(.5);
        this.add.image(400,300,'mode').setScale(.9);

        //Zona de EASY
        const starto=this.add.zone(310,138,180,87); 
        starto.setOrigin(0); 
        starto.setInteractive();
        starto.once('pointerdown',()=>this.changelevel(1));
        starto.once('pointerdown',()=>this.redirectScene('menuScene'));
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(starto); //graficar zona interactiva para visualizar 
         
        //Zona de MEDIUM
        const levelo=this.add.zone(310,255,180,87); 
        levelo.setOrigin(0); 
        levelo.setInteractive();
        levelo.once('pointerdown',()=>this.changelevel(2));
        levelo.once('pointerdown',()=>this.redirectScene('menuScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(levelo); 

        //Zona de HARD
        const modeo=this.add.zone(310,380,180,87); 
        modeo.setOrigin(0); 
        modeo.setInteractive();
        modeo.once('pointerdown',()=>this.changelevel(3));
        modeo.once('pointerdown',()=>this.redirectScene('menuScene'));
       //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(modeo);
    }

//DIFICULTAD DE NIVELES 
    changelevel(newlevel){
    nivel = newlevel; 
    nombrenivel = arraynombre[nivel-1]; 
    
             
    }
//FIN  
    redirectScene(sceneName){
    this.scene.start(sceneName);
    }

    update(){

    } 
}
class Menu extends Phaser.Scene{
    constructor(){
        super('menuScene');
    }
    preload(){
        this.load.image('fondo','./img/escenario.png');
        this.load.image('name','./img/JumKa.png');
        this.load.image('Cat','./img/character.png');
        this.load.image('controlesmenu','./img/menu.png');
        this.load.image('credit','./img/creditos.png');

    }
    create(){
        this.add.image(400,250,'fondo').setScale(2);
        this.add.image(400,50,'name');
        this.add.image(180,450,'Cat').setScale(.5);
        this.add.image(400,300,'controlesmenu').setScale(.9);
        this.add.image(700,445,'credit').setScale(.8);

        //Zona de start
        const starto=this.add.zone(310,110,180,87); 
        starto.setOrigin(0); 
        starto.setInteractive();
        starto.once('pointerdown',()=>this.redirectScene('gameScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(starto); //graficar zona interactiva para visualizar 
         
        //Zona de level
        const levelo=this.add.zone(310,205,180,87); 
        levelo.setOrigin(0); 
        levelo.setInteractive();
        levelo.once('pointerdown',()=>this.redirectScene('levelScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(levelo); 

        //Zona de mode
        const modeo=this.add.zone(310,304,180,87); 
        modeo.setOrigin(0); 
        modeo.setInteractive();
        modeo.once('pointerdown',()=>this.redirectScene('modeScene')); 
       //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(modeo);

        //Zona de controles
        const controlo=this.add.zone(310,404,180,87); 
        controlo.setOrigin(0); 
        controlo.setInteractive();
        controlo.once('pointerdown',()=>this.redirectScene('controlsScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(controlo);

        
        //Zona de CREDITOS
           const credito=this.add.zone(620,409,160,70); 
           credito.setOrigin(0); 
           credito.setInteractive();
           credito.once('pointerdown',()=>this.redirectScene('creditos')); 
           //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(credito);

        this.add.text(510,100,'Level Mode: '+nombrenivel,{fontSize:'23px', fill:'#46FF00'});
        this.add.text(510,150,'Players: '+jugadores,{fontSize:'23px', fill:'#46FF00'}); 


    }

    redirectScene(sceneName){
        this.scene.start(sceneName);
    }

    update(){

    } 
}
class Mode extends Phaser.Scene{
    constructor(){
        super('modeScene');
    }
    preload(){
        this.load.image('fondo','./img/escenario.png');
        this.load.image('name','./img/JumKa.png');
        this.load.image('Cat','./img/character.png');
        this.load.image('level','./img/players.png'); 
        

    }
    create(){
        this.add.image(400,250,'fondo').setScale(2);
        this.add.image(400,50,'name');
        this.add.image(180,450,'Cat').setScale(.5);
        this.add.image(400,300,'level').setScale(.9);

           //Zona Player 1
        const oneto=this.add.zone(310,160,180,87); 
        oneto.setOrigin(0); 
        oneto.setInteractive();
        oneto.once('pointerdown',()=>this.changeplayer(multijugador=1));
        oneto.once('pointerdown',()=>this.redirectScene('menuScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(oneto); //graficar zona interactiva para visualizar 
         
        //Zona Player 2
        const levelo=this.add.zone(310,255,180,87); 
        levelo.setOrigin(0); 
        levelo.setInteractive();
        levelo.once('pointerdown',()=>this.changeplayer(multijugador=2));
        levelo.once('pointerdown',()=>this.redirectScene('menuScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(levelo); 

        //Zona back
        const modeo=this.add.zone(310,354,180,87); 
        modeo.setOrigin(0); 
        modeo.setInteractive();
        modeo.once('pointerdown',()=>this.redirectScene('menuScene')); 
       //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(modeo);

    } 
    //DIFICULTAD DE NIVELES 
    changeplayer(multijugador){
        multijugador = multijugador; 
        jugadores = arrayjugador[multijugador -1]; 
                 
        }
    //FIN 

    redirectScene(sceneName){
        this.scene.start(sceneName);
    }

    update(){

    } 
}
class Controls extends Phaser.Scene{
    constructor(){
        super('controlsScene');
    }
    preload(){
        this.load.image('fondo','./img/escenario.png');
        this.load.image('name','./img/JumKa.png');
        this.load.image('ctrl1','./img/arrows.png');
        this.load.image('ctrl2','./img/movekeys.png');
        this.load.image('back','./img/back.png');

    }
    create(){

        this.add.image(400,250,'fondo').setScale(2);
        this.add.image(400,50,'name');
        this.add.image(200,300,'ctrl1').setScale(1.0);
        this.add.image(600,300,'ctrl2').setScale(1.0);
        this.add.image(420,480,'back').setScale(.8);

        //Zona de BACK
        const backy=this.add.zone(340,440,160,77); 
        backy.setOrigin(0); 
        backy.setInteractive();
        backy.once('pointerdown',()=>this.redirectScene('menuScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(backy);

        this.add.text(135,450,'Player 1',{fontSize:'28px', fill:'#46FF00'}); 
        this.add.text(540,450,'Player 2',{fontSize:'28px', fill:'#46FF00'}); 


    }
    redirectScene(sceneName){
        this.scene.start(sceneName);
    }

    update(){

    } 
}
class EndGame extends Phaser.Scene{
    constructor(){
        super('endScene');
    }
    preload(){
        this.load.image('fondo3','./img/gameover.png'); 
        this.load.image('again','./img/playagain.png');

    }
    create(){
        
        this.add.image(400,250,'fondo3').setScale(1.70);
        this.add.image(400,250,'again').setScale(.9); 

        this.add.text(250,100,'Player 1: '+player.score+'puntos',{fontSize: '28px',fill:'#fff'}); 
        if(multijugador==2){
            this.add.text(250,140,'Player 2: '+player2.score+'puntos',{fontSize: '28px' ,fill:'#fff'}); 
        }

          //Zona de play again
          const againo=this.add.zone(310,205,180,87); 
          againo.setOrigin(0); 
          againo.setInteractive();
          againo.once('pointerdown',()=>this.redirectScene('menuScene')); 
          //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(againo);
         
    }
    redirectScene(sceneName){
        this.scene.start(sceneName);
    }

    update(){

    } 
}

class Credits extends Phaser.Scene{
    constructor(){
        super('creditos');
    }
    preload(){
        this.load.image('fondo2','./img/end.png');
        this.load.image('backbutton','./img/back.png');

    }
    create(){
        
        this.add.image(430,280,'fondo2').setScale(1.50);
        this.add.image(630,495,'backbutton').setScale(.6); 

        //Zona de play again
        const againo2=this.add.zone(570,465,120,57); 
        againo2.setOrigin(0); 
        againo2.setInteractive();
        againo2.once('pointerdown',()=>this.redirectScene('menuScene')); 
        //this.add.graphics().lineStyle(2,0xff0000).strokeRectShape(againo2);

    }
    redirectScene(sceneName){
        this.scene.start(sceneName);
    }

    update(){

    } 
}

//configuracion generica de un juego 
const config ={
    type:Phaser.Auto,
    width:800,
    height:530,
    scene:[Menu,MainScene,Level,Mode,Controls,EndGame,Credits],
    scale:{
        mode:Phaser.Scale.FIT
    },physics:{
        default:'arcade',
        arcade:{
            debug:false,
            gravity:{
                y:300
            },
        },
     },
};
new Phaser.Game(config);