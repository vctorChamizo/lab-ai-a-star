class Nod {

    constructor (x, y) {

      this.X = x;
      this.Y = y;
      this.G = 0;
      this.H = 0;
      this.father = null;
    }
    
    get F () { return this.G + this.H; }
  }
