
// Here are all kernels used to calculate forces on particles

function Wpoly6(r, h){

	var radius = math.norm(r);

	if(radius < h && radius >= 0){
		w = (315/(64*Math.PI*Math.pow(h, 9))) * Math.pow((Math.pow(h, 2) - Math.pow(radius,2)),3);
	}else{
		w = 0;
	}

	return w;
}

function gradWpoly6(r, h){

	var radius = math.norm(r);

	if(radius < h && radius >= 0){
		gradient = multiplyVec( r, -(315/(64*Math.PI*Math.pow(h, 9))) * 6 * Math.pow((Math.pow(h, 2) - Math.pow(radius,2)),2));


	}else{
		gradient = [0, 0];
	}

	return gradient;
}

function laplacianWpoly6(r, h){

	var radius = math.norm(r);

	if(radius < h && radius >= 0){
		laplacian = (315/(64*Math.PI*Math.pow(h, 9))) * ( 24 * Math.pow(radius, 2) * (Math.pow(h, 2) - Math.pow(radius,2)) - 6 * Math.pow((Math.pow(h, 2) - Math.pow(radius,2)), 2) );
		 
	//	laplacian = (315/(64*pi*h^9)) * 				(24 * radius^2 * 			(h^2 - radius^2) 						- 6 * (h^2 - radius^2)^2);


	}else{
		laplacian = 0;
	}

	return laplacian;
}


function gradWspiky(r, h){

	var radius = math.norm(r);

	if(radius < h && radius > 0){
		gradient = multiplyVec(r, ((-15/(Math.PI*Math.pow(h, 6))) * 3 * Math.pow((h - radius),2) / radius));
	}else{
		gradient = [0, 0];
	}

	return gradient;
}

function laplacianWviscosity(r, h){

	var radius = math.norm(r);

	if(radius < h && radius >= 0){
		laplacian = (45/(Math.PI*Math.pow(h, 6))) * (h - radius);
	}else{
		laplacian = 0;
	}

	return laplacian;
}