
      console.log("Tá");
            var largura;
            var altura;
            var larguraMenu = 400;
            var alturaMenu = 300;

            canvas = document.getElementById("canvasMenu");
            ctx = canvas.getContext("2d");

            function atualizarPlanoDeFundo() {
                largura = window.innerWidth;
                altura = window.innerHeight;
                larguraMenu =largura/2;
                alturaMenu =altura/2;
                canvas.setAttribute("width", largura);
                canvas.setAttribute("height", altura);
                var img = new Image();
                img.src = "gt.jpg";
                
                ctx.drawImage(img, 0, 0,largura,altura);
            }

            function desenharBaseMenu() {
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                var x = parseInt((largura / 2) - (larguraMenu / 2));
                var y = parseInt((altura / 2) - (alturaMenu / 2));
                ctx.fillRect(x, y, larguraMenu, alturaMenu);
            }

            function desenharItensMenu() {
                var x = parseInt((largura / 2) - (larguraMenu / 2));
                var y = parseInt((altura / 2) - (alturaMenu / 2));
                var img;

                img = new Image();
                img.src = "iniciar_1.png";
                ctx.drawImage(img, x, y);

                img = new Image();
                img.src = "nivel_1.png";
                ctx.drawImage(img, x, y + 100);

                img = new Image();
                img.src = "tipo_1.png";
                ctx.drawImage(img, x, y + 200);
            }

            function selecionarItem(indice) {
                desenharMenu();
                var x = parseInt((largura / 2) - (larguraMenu / 2));
                var y = parseInt((altura / 2) - (alturaMenu / 2));
                var img;
                img = new Image();
                switch (indice) {
                    case 0:                        
                        img.src = "iniciar_2.png";
                        ctx.drawImage(img, x, y);
                        break;
                    case 1:
                        img.src = "nivel_2.png";
                        ctx.drawImage(img, x, y+ 100);
                        break;
                    case 2:
                        img.src = "tipo_2.png";
                        ctx.drawImage(img, x, y + 200);
                        break;
                }
            }

            function desenharMenu() {
                atualizarPlanoDeFundo();
                desenharBaseMenu();
                desenharItensMenu();

              
            }

            window.onresize = function () {
                desenharMenu();
            }

            window.onmousemove = function () {
                var posX = event.clientX;
                var posY = event.clientY;
                var x = parseInt((largura / 2) - (larguraMenu / 2));
                var y = parseInt((altura / 2) - (alturaMenu / 2));
                var indice = -1;

                if (posX > x && posX < x + larguraMenu) {
                    if (posY > y && posY < y + alturaMenu) {
                        indice = parseInt((posY - y) / 100);                        
                    }
                }

                selecionarItem(indice);
            }

            desenharMenu();
         