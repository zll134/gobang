//这是局势的评价函数

/*
http://http://g.onegreen.net/wzq/HTML/142336.htmlg.onegreen.net/wzq/HTML/142336.html
我们对五子棋的评分是简单的把棋盘上的各种连子的分值加起来得到的，对各种连子的基本评分规则如下：
    1、成五，100000
    2、活四, 10000
    3、活三 1000
    4、活二 100
    5、活一 10
如果一侧被封死但是另一侧没有，则评分降一个档次，也就是死四和活三是相同的分

    1、冲四, 1000
    2、冲三 100
    3、冲二 10
*/
//棋型对应的分数
var chesstypescore={
    'livefive':100000,//bbbbb
    'livefour':10000,//.bbbb.
    'livethree1':1000,
    'livethree2':1000,
    'livethree3':1000,
    'livethree4':1000,
    'livetwo1':100,
    'livetwo2':100,
    'livetwo3':100,
    'livetwo4':100,
    'livetwo5':100,
    'livetwo6':100,
    'liveone1':10,
    'liveone2':10,
    'liveone3':10,
    'liveone4':10,
    'deadfour1':1000,
    'deadfour2':1000,
    'deadfour3':1000,
    'deadfour4':1000,
    'deadfour5':1000,
    'deadthree1':100,
    'deadthree2':100,
    'deadthree3':100,
    'deadthree4':100,
    'deadthree5':100,
    'deadthree6':100,
    'deadthree7':100,
    'deadthree8':100,
    'deadthree9':100,
    'deadthree10':100,
    'deadtwo1':10,
    'deadtwo2':10,
    'deadtwo3':10,
    'deadtwo4':10,
    'deadtwo5':10,
    'deadtwo6':10,
    'deadtwo7':10
}

//黑子棋型
var blackchesstype={
    'livefive':[1,1,1,1,1],//bbbbb
    'livefour':[0,1,1,1,1,0],//.bbbb.
    'livethree1':[0,0,1,1,1,0],
    'livethree2':[0,1,1,1,0,0],
    'livethree3':[0,1,1,0,1,0],
    'livethree4':[0,1,0,1,1,0],
    'livetwo1':[0,0,1,1,0,0],
    'livetwo2':[0,0,1,0,1,0],
    'livetwo3':[0,1,0,0,1,0],
    'livetwo4':[0,1,1,0,0,0],
    'livetwo5':[0,0,0,1,1,0],
    'livetwo6':[0,1,0,1,0,0],
    'liveone1':[0,0,0,0,1,0],
    'liveone2':[0,1,0,0,0,0],
    'liveone3':[0,0,1,0,0,0],
    'liveone4':[0,0,0,1,0,0],
    'deadfour1':[-1,1,1,1,1,0],
    'deadfour2':[0,1,1,1,1,-1],
    'deadfour3':[1,0,1,1,1],
    'deadfour4':[1,1,0,1,1],
    'deadfour5':[1,1,1,0,1],
    'deadthree1':[0,0,1,1,1,-1],
    'deadthree2':[0,1,0,1,1,-1],
    'deadthree3':[0,1,1,0,1,-1],
    'deadthree4':[-1,0,1,1,1,0,-1],
    'deadthree5':[-1,1,1,1,0,0],
    'deadthree6':[-1,1,1,0,1,0],
    'deadthree7':[-1,1,0,1,1,0],
    'deadthree8':[1,0,0,1,1],
    'deadthree9':[1,0,1,0,1],
    'deadthree10':[1,1,0,0,1],
    'deadtwo1':[0,0,0,1,1,-1],
    'deadtwo2':[-1,1,1,0,0,0],
    'deadtwo3':[-1,1,0,1,0,0],
    'deadtwo4':[0,0,1,0,1,-1],
    'deadtwo5':[0,1,0,0,1,-1],
    'deadtwo6':[-1,1,0,0,1,0],
    'deadtwo7':[1,0,0,0,1]
}



//比较两个数组是否是一样的
//比较chessline[i,j)和arr是否相同，相同就返回true
function arrayequal(chessline,i,arr)
{
    var f=true;
    if(chessline.length<arr.length)//长度不一致时不可以的
         f=false;
    else{
        for(let index=0;index<arr.length;index ++)//元素对不上时，返回错误
            if(chessline[i+index]!=arr[index])
            {
                f=false;
                break;
            }
    }
    return f;
}

//color黑色是1 白色是-1
//计算每一行各种棋型的分数
function computescore(arr1,color)
{
    var score=0;
    let arr=com.arrclone(arr1);
    arr.push((-1)*color);
    arr.unshift((-1)*color);
    for(let i in blackchesstype)
    {
        var curarr=com.arrclone(blackchesstype[i]);
        if(curarr.length>arr.length)
            continue;

        //不同颜色，不同的棋型数组
        for (let j=0;j<curarr.length;j++)
            curarr[j]=curarr[j]*color;
        //
        for(let j=0;j<=arr.length-curarr.length;j++)
            if(arrayequal(arr,j,curarr))
                score=score+chesstypescore[i];  
    }
    return score; 
}
function evaluate(map)
{
    var n=map.length;
    var m=map[0].length;
    var scoreb=0;//统计黑子的棋型分数，黑子为人类棋手
    var scorew=0;//白棋的棋型分数，白子为电脑执子

    //-、/、\三种方向
    for(let i=0;i<n;i++)
    {
        var arr1=[],arr2=[],arr3=[];
        for(let j=0;j<m;j++)
            arr1.push(map[i][j]);
        for(let j=0;j<n+m;j++) 
        {
            if(i+j<n&&j<m)
                arr2.push(map[i+j][j]);
            if(i-j>=0&&j<m)
                arr3.push(map[i-j][j]);
        }
        scoreb=scoreb+computescore(arr1,1);
        scoreb=scoreb+computescore(arr2,1);
        scoreb=scoreb+computescore(arr3,1);
        scorew=scorew+computescore(arr1,-1);
        scorew=scorew+computescore(arr2,-1);
        scorew=scorew+computescore(arr3,-1);
    }

    //|方向
    for(let i=0;i<m;i++)
    {
        var arr1=[];
        for (let j=0;j<n;j++)
            arr1.push(map[j][i]);
        scoreb=scoreb+computescore(arr1,1);
        scorew=scorew+computescore(arr1,-1);
    }
    return scorew-scoreb;
}
