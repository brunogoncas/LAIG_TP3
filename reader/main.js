//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

var boardFromProlog= [];


function getPrologRequest(requestString, onSuccess, onError, port)
{
  console.log("Request!!");
  var requestPort = port || 8081
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);
                                                };
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();


}

function initRequest()
{
  // Get Parameter Values
  var requestString = "init";

  // Make Request
  getPrologRequest(requestString, handleReply);
}

function moveRequest(Player,OldX,OldY,NewX,NewY,Board,Piece)
{
  // Get Parameter Values
  var requestString = "move("+Player+","+OldX+","+OldY+","+NewX+","+NewY+","+Board+","+Piece+")";

  console.log("MOVE REQUEST");
  console.log(Board);

  // Make Request
  getPrologRequest(requestString, handleReply);
}

//Handle the Reply
function handleReply(data){
  //console.log(data.target.response);
  boardFromProlog=data.target.response;
  boardFromProlog = boardFromProlog.replace(/x/g, String.fromCharCode(39)+"x"+String.fromCharCode(39));
  boardFromProlog = boardFromProlog.replace(/b/g, String.fromCharCode(39)+"b"+String.fromCharCode(39));
  boardFromProlog = boardFromProlog.replace(/w/g, String.fromCharCode(39)+"w"+String.fromCharCode(39));
  boardFromProlog = boardFromProlog.replace(/k/g, String.fromCharCode(39)+"k"+String.fromCharCode(39));
  boardFromProlog = boardFromProlog.replace(/e/g, String.fromCharCode(39)+"e"+String.fromCharCode(39));

  console.log(boardFromProlog);
}



function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}


serialInclude(['../lib/CGF.js', 'Scene.js', 'Parser.js', 'Texture.js', 'Interface.js', 'Material.js', 'Node.js',
'primitives/Rectangle.js', 'primitives/Cylinder.js', 'primitives/Sphere.js', 'primitives/Triangle.js',
'primitives/CylinderCircle.js', 'primitives/CylinderShell.js', 'primitives/Vehicle.js',
'primitives/Plane.js', 'primitives/Patch.js', 'primitives/Terrain.js', 'primitives/cube.js',
'animations/CircularAnimation.js', 'animations/LinearAnimation.js', 'animations/PieceAnimation.js',
'jogo/GameState.js', 'jogo/Piece.js', 'jogo/KingPiece.js',




main=function()
{
  //teste







	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myScene = new Scene();

    app.init();

    app.setScene(myScene);


    // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
      // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)

      var filename=getUrlVars()['file'] || "1/table.lsx";
      var filename2=getUrlVars()['file'] || "1/piquenique.lsx";


      // create and load graph, and associate it to scene.
      // Check console for loading errors
      var parser = new Parser(filename, myScene, "Quarto");
      var parser2 = new Parser(filename2, myScene, "Piquenique");
      //var parser3 = new Parser(filename3, myScene , "Outro");
      //var interface = new Interface(myInterface);
      var myInterface = new Interface(myScene);
      myInterface.setActiveCamera(myScene.camera);
      app.setInterface(myInterface);
      // start

      app.run();
    }


]);
