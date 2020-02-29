

var com=com||{};

com.init=function(){

    //准备画布
    com.canvas=document.getElementById('chess');
    com.ctx=com.canvas.getContext("2d");

    //棋盘与棋子参数
    com.interval=25;//着点间的间隔
    com.dim=15;//棋盘的维度
    com.startpx=73;//左上点的坐标x,j
    com.startpy=80;//y,i
    com.piecesize=20;
   
    //导入棋子和棋盘和dot图片
    com.blackpiece=new Image();
    com.blackpiece.src='img/black.jpg';//黑子
    com.whitepiece=new Image();
    com.whitepiece.src='img/white.jpg';//白子
    com.bgimg=new Image();
    com.bgimg.src='img/bg.jpg';//棋盘
    com.dotimg=new Image();
    com.dotimg.src='img/dot.png';
    
    //棋子的坐标矩阵0表示没有棋子，1表示黑棋，-1表示白棋
    com.chessmap=new Array(15);
    for(var i=0;i<15;i++)
    {
        com.chessmap[i]=new Array(15);
        for(var j=0;j<15;j++)
            com.chessmap[i][j]=0;
    }   
    
    //73,80为棋盘的起始点，相对坐标为23,30,
     com.bgimg.onload=function(){
        com.ctx.drawImage(com.bgimg,50,50);
    }
    //放置dot图片
    com.isputdot=false;
    com.doti=0;
    com.dotj=0;

    //记录历史棋局
    com.history=[];
    com.history.push(com.matrixclone(com.chessmap));
    com.step=0;
}

//获取ID
com.get = function (id){
	return document.getElementById(id);
}

//二维数组的克隆
com.matrixclone=function( map)
{
    let temp=[];
    for (let index = 0; index < map.length; index++) 
    {
        let arr=new Array();
        for(let j=0;j<map[index].length;j++)
            arr.push(map[index][j]);
        temp.push(arr);
    }

    return temp;
}
//以为数组克隆,避免传引用。
com.arrclone=function(arr)
{
    let arr1=new Array();
    for(let i=0;i<arr.length;i++)
        arr1.push(arr[i]);
    return arr1;
}


//放置棋子
com.putpieceimg=function(img,i,j)
{
    var y=com.startpy+i*com.interval;
    var x=com.startpx+j*com.interval;
    com.ctx.drawImage(img,x-com.piecesize/2,y-com.piecesize/2,com.piecesize,com.piecesize);
}
//放着dot图片
com.putdotimg=function(i,j)
{
    var y=com.startpy+i*com.interval;
    var x=com.startpx+j*com.interval;
    com.ctx.drawImage(com.dotimg,x-5,y-5,10,10);
}
//移除棋子，dot
com.removeimg=function(i,j)
{
    var y=com.startpy+i*com.interval-com.piecesize/2;
    var x=com.startpx+j*com.interval-com.piecesize/2;
    com.ctx.clearRect(x,y,com.piecesize,com.piecesize);
    com.ctx.drawImage(com.bgimg,x,y,com.piecesize,com.piecesize,x,y,com.piecesize,com.piecesize);
}

window .onload=function(){
    com.init();

    //点击事件,首先出现dot点
    com.canvas.addEventListener('click',function(e){
            console.log(e);
            var x=e.offsetX;//j
            var y=e.offsetY;//i
            var i=Math.round((y-com.startpy)/com.interval);
            var j=Math.round((x-com.startpx)/com.interval);

            if(com.chessmap[i][j]==0)//放置dot点，点只能存在一个
            {
                com.putdotimg(i,j);
                if(com.isputdot)//如果点存在移除点
                    com.removeimg(com.doti,com.dotj);
                else
                    com.isputdot=true;//不存在就点上点
                com.doti=i;
                com.dotj=j;
            }
    });

    //点击按钮确定落子，才落子
    com.get('comfirmBtn').addEventListener('click',function(){
            //把点移除
            if(com.isputdot)
            {
                com.isputdot=false;
                com.removeimg(com.doti,com.dotj);
                //放置棋子
                com.putpieceimg(com.blackpiece,com.doti,com.dotj);
                com.chessmap[com.doti][com.dotj]=1;
            }
            //然后电脑下
            
            var complay=maxminsearch(com.chessmap,-1,3,-Infinity,Infinity);
            com.putpieceimg(com.whitepiece,complay.i,complay.j);
            com.chessmap[complay.i][complay.j]=-1;
            
           
    })

    //点击重新开始按钮，棋盘初始化
    com.get('startBtn').addEventListener('click',function(){
            com.ctx.clearRect(0,0,500,500);
            com.ctx.drawImage(com.bgimg,50,50);
            for(let i=0;i<15;i++)
                for(let j=0;j<15;j++)
                    com.chessmap[i][j]=0;
    })

    //下黑棋
    com.get('blackbtn').addEventListener('click',function(){
        //把点移除
        if(com.isputdot)
        {
            com.isputdot=false;
            com.removeimg(com.doti,com.dotj);
            //放置棋子
            com.putpieceimg(com.blackpiece,com.doti,com.dotj);
            com.chessmap[com.doti][com.dotj]=1;

            //记录为历史值
            com.step++;
            com.history.push(com.matrixclone(com.chessmap));
        }
        console.log(evaluate(com.chessmap));
    })

      //下白棋
    com.get('whitebtn').addEventListener('click',function(){
        //把点移除
        if(com.isputdot)
        {
            com.isputdot=false;
            com.removeimg(com.doti,com.dotj);
            //放置棋子
            com.putpieceimg(com.whitepiece,com.doti,com.dotj);
            com.chessmap[com.doti][com.dotj]=-1;

             //记录为历史值,存在深浅拷贝的问题
             com.step++;
             com.history.push(com.matrixclone(com.chessmap));
        }
        console.log(evaluate(com.chessmap));
    })

      //悔棋
    com.get('regretBtn').addEventListener('click',function(){
        if(com.step>0)
        {
            com.step--;
            com.history.pop();
            //棋盘回滚
            com.chessmap=com.matrixclone(com.history[com.step]);
            com.ctx.clearRect(0,0,500,500);
            com.ctx.drawImage(com.bgimg,50,50);
            for(var i=0;i<15;i++)
            for(var j=0;j<15;j++)
            {
                if(com.chessmap[i][j]==1)
                 com.ctx.drawImage(com.blackpiece,73+j*25-10,80+i*25-10,com.piecesize,com.piecesize);
                if(com.chessmap[i][j]==-1)
                 com.ctx.drawImage(com.whitepiece,73+j*25-10,80+i*25-10,com.piecesize,com.piecesize);
            }  
        }
        console.log(evaluate(com.chessmap));

    }
    )
    //选择后手
    com.get('houshou').addEventListener('click',function(){
        com.chessmap[7][7]=-1;
        com.ctx.drawImage(com.whitepiece,73+7*25-10,80+7*25-10,20,20);
        com.history.push(com.matrixclone(com.chessmap));
        com.step++;
    })
    
}




