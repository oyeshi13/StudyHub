#include<bits/stdc++.h>
using namespace std;
class Edge{
   public:
    int u,v,w;
    Edge(int u,int v,int w){
        this->u=u;
        this->v=v;
        this->w=w;
    }
    //comparator=> <
    bool operator<(const Edge &other)const{
        return this->w < other.w;
    }
};
class Graph{
    public:
    int V;
    vector<Edge> edges;
    vector<int> par,rank;
    Graph(int V){
        this->V=V;
        for(int i=0;i<V;i++){
            par.push_back(i);
            rank.push_back(0);
        }
    }
    void addEdge(int u,int v,int w){
        edges.push_back(Edge(u,v,w));
    }
    int find(int x){
        if(par[x]==x)
        return x;
        return par[x]=find(par[x]);
        
    }
    void unionByRank(int a,int b){
        int parA=find(a);
        int parB=find(b);
        if(parA==parB)
        return;
        if(rank[parA]==rank[parB]){
            par[parB]=parA;
            rank[parA]++;
        }
             else if(rank[parA]>rank[parB]){
                 par[parB]=parA;
                }
    
                  else 
                    {
                        par[parA]=parB;
                    }
    }
    void Kruskal(){//O(ElogE)
        sort(edges.begin(),edges.end());//O(ElogE)
        int mstCost=0;
        int edgesUsed=0;
        for(int i=0;i<edges.size();i++){//O(E)
            Edge e=edges[i];
            int parU=find(e.u);//O(1)
            int parV=find(e.v);
            if(parU!=parV){
                //No cycle;
                unionByRank(e.u,e.v);//O(1)
                edgesUsed++;
                mstCost+=e.w;
            }
        }
          if(edgesUsed!=V-1)
        {
            cout<<"impossible"<<endl;
            return;
        }
        cout<<"MST Cost: "<<mstCost<<endl;
    }

};
int main(){
    Graph g(4);

    g.addEdge(0,1,10);
    g.addEdge(0,2,6);
    g.addEdge(0,3,5);
    g.addEdge(1,3,15);
    g.addEdge(2,3,4);
    g.Kruskal();


}