
//还需要棋盘上可以落子的位置的优先顺序
function gen(map,color)
{
    var board=[];
    for(let i=0;i<map.length;i++)
    {
        var arr=new Array();
        for (let j=0;j<map[0].length;j++)
            arr.push(100);
        board.push(arr);
    }
       
    //首先，棋子中的邻域大于三的不需要搜索,与棋子距离短的空格优先搜索
    for(let i=0;i<map.length;i++)
        for(let j=0;j<map[0].length;j++)
            if(map[i][j]!=0)
            {
                for (let k=-2;k<=2;k++)
                    for (let l=-2;l<=2;l++ )
                    {
                        if(i+k>=0&&i+k<=14&&j+l>=0&&j+l<=14&&map[i+k][j+l]==0)
                            board[i+k][j+l]=Math.max(Math.abs(k),Math.abs(l));
                    }
            }
    var chessstep=[]
    for(let i=0;i<map.length;i++)
        for(let j=0;j<map[0].length;j++)
            if(board[i][j]!=100)
            {
                map[i][j]=color;
                let v=evaluate(map);//落点的评分表
                chessstep.push({'i':i,'j':j,'value':v});
                map[i][j]=0;
            }
                
    return chessstep;
}
//博弈树与alpha_beta剪枝,alpha=-Infinity,beta=Infinity
//beta表示极小层的最小值，alpha 表示极大层的最大值
//在极小层搜索时，如果beta小于alpha时，则停止后续搜索
//在极大层搜索时，如果alpha大于beta时则停止搜索
function maxminsearch(map,color,depth,alpha,beta)
{
    var n=map.length;
    var m=map[0].length;
    var bestvalue;
    var indexi=7,indexj=7;//初始就下中间
    if(color==-1)
    {
        bestvalue=-Infinity;
        //挑选出分高的放前面
        var chessarr=gen(map,color);
        chessarr.sort(function(a,b){return(b.value-a.value);})
        for (let k=0;k<Math.min(chessarr.length,10);k++)
        {
            var i=chessarr[k].i,j=chessarr[k].j;
                if(map[i][j]==0)
                {
                    if(alpha>=beta)
                        return{'value':alpha,'i':indexi,'j':indexj};
                    map[i][j]=color;
                    var value;
                    //深度优先搜索
                    if(depth==0)
                    {
                        value=evaluate(map);  
                    }
                    else{
                        value=maxminsearch(map,1,depth-1,alpha,beta).value;
                    }
                    map[i][j]=0;//恢复那一个点
                    if(bestvalue<value)
                    {
                            indexi=i;
                            indexj=j;
                            bestvalue=value;
                    }
                    if(alpha<bestvalue)
                        alpha=bestvalue;
                    
                    
                }
        }
        return {'value':bestvalue,'i':indexi,'j':indexj};
    }
    else{
        //人下棋，找价值最小的那个位置，最小搜索
        bestvalue=Infinity;
        var chessarr=gen(map,color);
        chessarr.sort(function(a,b){return(a.value-b.value);})
        for (let k=0;k<Math.min(chessarr.length,10);k++)
        {
            var i=chessarr[k].i,j=chessarr[k].j;
                if(map[i][j]==0)
                {
                       //alpha beta 剪枝
                    if(beta<=alpha)
                       return  {'value':beta,'i':indexi,'j':indexj};
                    map[i][j]=color;
                    var value;

                    //深度优先搜索
                    if(depth==0)
                    {
                        value= evaluate(map);  
                    }
                    else{
                        value=maxminsearch(map,-1,depth-1,alpha,beta).value;
                    }
                    map[i][j]=0;//恢复
                    if(bestvalue>value)
                    {
                            indexi=i;
                            indexj=j;
                            bestvalue=value;
                    }
                    if(beta>=bestvalue)
                    {
                        beta=bestvalue;
                    }    
                }
        }
        return {'value':bestvalue,'i':indexi,'j':indexj};
    }

    
}
