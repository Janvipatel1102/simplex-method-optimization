

function getInput() {
    var n = document.getElementById('variables').value;
    if (n > 5) {
        alert("Please enter valid number of variables!")
        return
    }
    let existingInputs = document.getElementById('objective_function').getElementsByTagName("input")
    while (existingInputs.length != 0) {
        existingInputs[0].remove()
    }
    for (var i = 0; i < n; i++) {
        var input_node = document.createElement('input');
        input_node.setAttribute('type', Number);
        input_node.setAttribute('class', 'mx-2')
        document.getElementById('objective_function').appendChild(input_node);
    }
}
function getConstraints() {
    var m = document.getElementById('variables').value;
    var n = document.getElementById('constraints').value;
    if (m > 5 || n > 5) {
        alert("Please enter valid number of variables!")
        return
    }
    let existingConstraints = document.getElementById('constraints_input').getElementsByTagName("div");
    var i = 0;
    while (existingConstraints.length != 1) {
        // while(existingConstraints[0].length!=0)
        //{
        existingConstraints[1].remove()
        //}


    }
    for (var i = 0; i < n; i++) {
        var div = document.createElement('div');
        div.setAttribute('class', 'p-2')


        for (var j = 0; j < m; j++) {
            var input_node = document.createElement('input');
            input_node.setAttribute('type', Number);
            input_node.setAttribute('class', 'mx-2 con')
            //input_node.setAttribute('value', 22)
            div.appendChild(input_node);
        }

        var text = document.createElement('span')
        var textNode = document.createTextNode(' <= ');
        text.appendChild(textNode);
        div.appendChild(text);
         
        var input_node = document.createElement('input');
        input_node.setAttribute('type', Number);
        input_node.setAttribute('class', 'mx-2 con')
       // input_node.setAttribute('value', 22)

        div.appendChild(input_node);
        
        document.getElementById('constraints_input').appendChild(div);


    }
}

getConstraints();
getInput();

const simplexMethod = async () => {
    var m = document.getElementById('variables').value;
    var n = document.getElementById('constraints').value;
    let objective_inputs = document.getElementById('objective_function').getElementsByTagName("input")
    let constraints = document.getElementsByClassName('con')
   
    let objctive_list =[]
    let constraints_list=[]
    for(var i=0;i<m;i++)
    {
         objctive_list.push(parseInt(objective_inputs[i].value))
    }

    const totalInputInRow = parseInt(m) + 1;
    let costs=[]
    for(var i=0;i<constraints.length;i++)
    {
       // console.log((i/(m+1)) , i, totalInputInRow);
        let index = Math.floor(i/totalInputInRow);
        if(i % totalInputInRow == 0){
            constraints_list.push([])
        }
      
        if((i+1) % totalInputInRow == 0)
        {
            costs.push(parseInt(constraints[i].value));
        }
        else
        constraints_list[index].push(parseInt(constraints[i].value))
    }
    var myBody = {
        'const': parseInt(n),
        'var' :parseInt(m),
        'objective':objctive_list,
         'constraints':constraints_list  ,
         'costs':costs
         }
    const response = await fetch('http://127.0.0.1:5000/simplex_method', {
        method: 'POST',
        body: JSON.stringify(myBody), // string or object
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' :'*'
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);
    optimal_solution(myJson['data']);
    

    // do something with myJson
}
/*function getFraction(decimal)
{
    function highestCommonFactor(a,b) {
        if (b==0) return a;
        return highestCommonFactor(b,a%b);
    }
    decimal=decimal.toString();
    var decimalArray = decimal.split(".");
    if(decimalArray.length==1)
    {
        return decimal;
    }
    var leftDecimalPart = decimalArray[0]; 
    var rightDecimalPart = decimalArray[1]; 

    var numerator = leftDecimalPart + rightDecimalPart 
    var denominator = Math.pow(10,rightDecimalPart.length); 
    var factor = highestCommonFactor(numerator, denominator); 
    denominator /= factor;
    numerator /= factor;
    if(denominator<0){
        denominator=-(denominator);
        numerator=-numerator;
    }
    return numerator + "/" + denominator;

}*/

function optimal_solution(data)
{
    document.getElementById('tables').innerHTML='';
    document.getElementById('optimulSolution').innerHTML='';

    var m = document.getElementById('variables').value;
    var n = document.getElementById('constraints').value;
   
    let table_header = [];
    table_header.push('CB')
    table_header.push('B')
    table_header.push('Xb')
    table_header.push('b');
    let totalVariables = parseInt(m)+parseInt(n);
    for(let i=0;i<totalVariables;i++)
    {
        table_header.push('a'+(i+1).toString());
    }
    table_header.push('Min_Ration');
    table_header.push('Operations');

    for(let k=0;k<data.length-3;k++)
    {
        let table=document.createElement("table");
        table.setAttribute("class",'table table-bordered borders-dark table-striped text-center m-50 ');

        for(let i=0;i<data[0].length+1;i++)
        {
            let row =document.createElement('tr')
            
            if(i==0)
                row.setAttribute('class','table_header table-primary')
            else
            row.setAttribute('class','table_row')
            for(let j=0;j<data[0][0].length;j++)
            {
                    var col = document.createElement("td");
                    if(i==0)
                    {
                        col.setAttribute('class','table_heading');
                        let text=document.createTextNode(table_header[j]);
                        col.appendChild(text);
                        row.appendChild(col);

                    }
                    else{
                        col.setAttribute('class','table_cell');
                        let x=data[k][i-1][j];
                        let x1,text;
                        text=document.createTextNode(x);
                        col.appendChild(text);
                        row.appendChild(col);
            
                    }
                
                }
                table.appendChild(row);

        }
        document.getElementById('tables').appendChild(table);

    }
    let p = document.createElement('p');
    let text = document.createTextNode('The Optimal Solution is :')
    p.appendChild(text);
    document.getElementById('optimulSolution').appendChild(p);


    for(let i=0;i<m;i++)
    {
        p = document.createElement('p');
        let text = document.createTextNode(data[data.length-2][i]+' = '+data[data.length-3][i].toString());
        p.appendChild(text);
        document.getElementById('optimulSolution').appendChild(p);

    
    }
    p = document.createElement('p');
    text=document.createTextNode('Z = '+data[data.length-1].toString());
    p.appendChild(text);
    document.getElementById('optimulSolution').appendChild(p);
    
       


}

