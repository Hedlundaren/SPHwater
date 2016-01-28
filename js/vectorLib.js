function norm(vec){ //returns normalized vector

	//console.log(vec);
	var x;
	var y;

	x = vec[0]/math.norm(math.matrix([vec[0],vec[1]]),2);
	y = vec[1]/math.norm(math.matrix([vec[0],vec[1]]),2);
	

	return [x,y];
}

function addVectors(v1, v2){

	return [v1[0] + v2[0], v1[1] + v2[1]];
}

function subtractVectors(v1, v2){

	return [v1[0] - v2[0], v1[1] - v2[1]];
}

function vecLength(vec){

	return Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2));
}

function multiplyVec(vec, c){

	return [c*vec[0],c*vec[1]];
}