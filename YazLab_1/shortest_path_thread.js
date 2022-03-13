function get_dist(a,i,j){
    return a[i + " " + j]
}

onmessage = function(e) {

    let shortest_path = []
    let leng = []
    let permutations = []

    shortest_paths = e.data[0]
    leng = e.data[1]
    permutations = []
    console.log("thread sp type", typeof shortest_paths)

    let indexes = []
    for(let i=1; i<leng; i++){
        indexes.push(i)
    }
    if(indexes.length < 0){
        
    }
    else{
        permutation(permutations, [], indexes)

        console.log("permutations", permutations)

        let min_km = Infinity
        let shortest_permutation = []

        for(let i=0; i<permutations.length; i++){
            let km = 0
            for(let j=0; j<permutations[i].length - 1; j++){
                console.log(get_dist(shortest_paths,permutations[i][j], permutations[i][j+1]))
                km += get_dist(shortest_paths,permutations[i][j], permutations[i][j+1])
            }
            if(km < min_km){
                shortest_permutation = permutations[i]
                min_km = km
            }
        }
        console.log(shortest_permutation)
        postMessage([min_km, shortest_permutation]);
    }

}

function permutation(permutations,selected, remaining){
    if(remaining.length == 0){
        selected.unshift(0)
        permutations.push(selected)
        return
    }
    else{
        for(let i=0; i<remaining.length; i++){
            let selected2 = JSON.parse(JSON.stringify(selected))
            selected2.push(remaining[i])
            let remaining2 = JSON.parse(JSON.stringify(remaining))
            remaining2.splice(i, 1);
            permutation(permutations, selected2, remaining2)
        }
    }
}