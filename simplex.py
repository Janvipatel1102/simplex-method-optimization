from flask import Flask, jsonify, request 
from flask_cors import CORS, cross_origin
import json

# creating a Flask app 
app = Flask(__name__) 
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/simplex_method', methods = ['POST','OPTIONS']) 
@cross_origin()
def disp():
    body=request.json
    print(body)
    optimul_solution = simplex_method(body)
    print(optimul_solution)
    return {'data': optimul_solution}






import numpy as np
import pandas as pd

def simplex_method(simplex):
    
    variable=int(simplex.get('var'));
    constraints=int(simplex.get('const'))
    objective = simplex.get('objective')


    A=simplex.get('constraints')
    B = simplex.get('costs')
   

    v=variable
    for i in range (0,constraints):
        for j in range(0,constraints):
            A[i].append(0);
        A[i][v]=1;
        v=v+1;
        objective.append(0)
    #print(A)
    #print(B)
    #print(objective)

    #table 0

    basic =[]
    cb=[]
    xb = []
    operation=[]
    for i in range(0,constraints):
        basic.append('a'+str(variable+i+1))
        cb.append(0)
        xb.append('x'+str(variable+i+1))
        operation.append(0)

    ope =''
    column = []
    for i in range(1,constraints+variable+1):
        column.append('a'+str(i))
    #print(column)

    cb.append('Zj-Cj')
    basic.append(' ')
    xb.append(' ')
    B.append(0)

    data = {'CB':cb,'B': basic,'Xb': xb,'b':B}
    #print(data)

    z = []
    for i in range (0,len(objective)):
        if(objective[i]==0):
            z.append(0);
        else:
            z.append(-objective[i]);
    zmin=z.index(min(z))
    minratio=[]

    a_dum=[]
    for i in range(variable+constraints):
        a_dum.append(z[i])
    A.append(a_dum)
    arr = np.array(A)

    for i in range (0,len(column)):
        data[column[i]] =arr[:,i]
    for i in range(0,constraints):
        if(A[i][zmin]>0):
            minratio.append(round(B[i]/A[i][zmin],2));
        else:
            minratio.append(10000000);
    pivot =minratio.index(min(minratio))
    #print(zmin)
    #print(minratio)
    #print(pivot)
    minratio.append(' ')
    data['minratio'] = minratio
    data ['operation'] = ope
    df=pd.DataFrame(data)
    #df.columns=df.columns.str.strip()

    operation.append(' ')
    #df1 = df.style.set_properties(color="white", align="right")
    #df1 = df.style.set_properties(**{'font-size':'10pt','height':'10pt','width':'300pt'})
    answer=[]
    answer.append(df.values.tolist())
    b=B

    flag=0;
    
    while(flag==0):

        leaving = df[basic[pivot]].values.tolist()
        leaving=leaving[0:constraints]
        entering  = df['a'+str(zmin+1)].values.tolist()
        entering=entering[0:constraints]
        index = leaving.index(1)
        val=entering[index]
        string = 'R'+str(index+1)+" ' = "+'R'+str(index+1)+'/'+str(val)
        operation[index]= string;
        basic[pivot]='a'+str(zmin+1)
        xb[pivot]='x'+str(zmin+1)
        cb[pivot]=round(objective[zmin],2)
        arr_dum=A
        b[index]=round((b[index]/val),2);

        for i in range(0,variable+constraints):
            arr_dum[index][i]=round(arr_dum[index][i]/val,2);


        for i in range (0,constraints):
            if(i!=index):
                val =entering[i]
                s='R'+str(i+1)+"' = "+'R'+str(i+1)+'-'+str(val)+'*'+'R'+str(index+1)+"'"
                operation[i]=s;
                for j in range(0,constraints+variable):
                    arr_dum[i][j]=round(arr_dum[i][j]-val*arr_dum[index][j],2)
                b[i]=round(b[i]-val*b[index],2)

        su=0;
        for i in range(0,constraints):
            su=su+cb[i]*b[i]
        b[constraints]=round(su,2);
        z = []


        for i in range (0,variable+constraints):
            sum=0;
            for j in range(0,constraints):
                sum=sum+(cb[j]*arr_dum[j][i])
            sum=sum-objective[i]
            z.append(round(sum,2));
        ind=constraints;
        for i in range(variable+constraints):
                arr_dum[ind][i] = round(z[i],2)

        ar=np.array(arr_dum)

        data = {'CB':cb,'B': basic,'Xb': xb,'b':b}

        for i in range(0,variable+constraints):
            data[column[i]] =ar[:,i]


        zmin=z.index(min(z))

        minratio=[]
        min_dum=[]
        if(min(z)>=0):
            flag=1;
        if(flag==0):
            for i in range(0,constraints):
                if(arr_dum[i][zmin]>0):
                    minratio.append(round(b[i]/arr_dum[i][zmin],2))
                    min_dum.append(round(b[i]/arr_dum[i][zmin],2))
                else:
                    minratio.append(100000000)
                    min_dum.append(' ')
            pivot =minratio.index(min(minratio))
            min_dum.append(' ')
        #print(zmin)
        #print(pivot)
        else:
            min_dum=''

        data['minratio'] = min_dum
        data ['operation'] = operation
       # df.columns=df.columns.str.lstrip()

        df=pd.DataFrame(data)
        #df1 = df.style.set_properties(color="white", align="right")
        #df1 =df.style.set_properties(**{'font-size':'10pt','height':'10pt','width':'300pt'})
        
        answer.append(df.values.tolist())
        A=arr_dum

   
    ans = np.zeros(variable)
    for i in range(0,constraints):
        s=int(xb[i][1])
        if(s<=variable):
            ans[s-1]=round(b[i],2);
    temp=[]
    for i in range(0,variable):
        temp.append('x'+str(i+1))
    answer.append(ans.tolist())
    answer.append(temp)
    answer.append(b[constraints])
    return answer
    
# driver function 
if __name__ == '__main__': 

    app.run(debug = True) 

