

//博弈树与alpha_beta剪枝
function maxminsearch(map,color,depth)
{
    var n=map.length;
    var m=map[0].length;
    var bestvalue;
    var indexi=7,indexj=7;//初始就下中间
    if(color==-1)
    {
        //电脑下棋，找打价值最大的位置，最大搜索
        bestvalue=-Infinity;
        for(let i=0;i<n;i++)
            for(let j=0;j<m;j++)
                if(map[i][j]==0)
                {
                    map[i][j]=color;
                    var value;
                    //深度优先搜索
                    if(depth==0)
                    {
                        value= evaluate(map);  
                    }
                    else{
            
                        value=maxminsearch(map,1,depth-1).value;
                    }
                    if(bestvalue<value)
                    {
                            indexi=i;
                            indexj=j;
                            bestvalue=value;
                    }
                    map[i][j]=0;
                    
                }
        return {'value':bestvalue,'i':indexi,'j':indexj};
    }
    else{
        //人下棋，找价值最小的那个位置，最小搜索
        bestvalue=Infinity;
        for(let i=0;i<n;i++)
            for(let j=0;j<m;j++)
                if(map[i][j]==0)
                {
                    map[i][j]=color;
                    var value;

                    //深度优先搜索
                    if(depth==0)
                    {
                        value= evaluate(map);  
                    }
                    else{
                        value=maxminsearch(map,-1,depth-1).value;
                    }

                    if(bestvalue>value)
                    {
                            indexi=i;
                            indexj=j;
                            bestvalue=value;
                    }
                    map[i][j]=0;
                }

        return {'value':bestvalue,'i':indexi,'j':indexj};
    }

    
}
