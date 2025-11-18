import p5 from 'p5';


export function drawGrid(p: p5) {
    // small grid
    p.stroke(255, 255, 255, 20);
    p.strokeWeight(1);
    for (let x = 0; x < p.width; x += 20)  p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += 20) p.line(0, y, p.width, y);

    // large grid
    p.strokeWeight(2);
    for (let x = 0; x < p.width; x += 100)  p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += 100) p.line(0, y, p.width, y);
}

export function drawBorder(p: p5) {
    p.noFill(); 
    p.stroke(255); 
    p.strokeWeight(3); 
    p.rect(20, 20, p.width - 40, p.height - 40);
}
