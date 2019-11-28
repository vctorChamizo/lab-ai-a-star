class A_Star {

    constructor (N, M, n_ini, n_fin, l_obs) {

        this.dimN = N;
        this.dimM = M
        this.nod_ini = n_ini;
        this.nod_fin = n_fin;
        this.list_close = l_obs;

        this.list_open = [];
        this.matrix = [];
    }

    run() {

        let nod_active;
        let end = false;

        this.matrix = create_matrix(this.dimM, this.dimN, this.list_close);

        this.nod_ini.H = euclid_dist(this.nod_ini, this.nod_fin);
        nod_active = this.nod_ini;
        this.list_open.push(nod_active);

        while (this.list_open.length > 0 && !end) {

            expand(nod_active, this.matrix, this.list_open, this.list_close, this.nod_fin, this.dimN, this.dimM);
            this.list_open.shift();
            this.list_open.sort(function (n1, n2) { return n1.G - n2.G; });
            nod_active = this.list_open[0];

            if (nod_active == undefined) end = true;
            else if (are_equal(nod_active, this.nod_fin)) {

                this.list_close.push(nod_active);
                end = true;
            }
        }

        if (nod_active == undefined) return null;

        let list_way = [];
        while (nod_active.father != null) {

            list_way.push(nod_active.father);
            nod_active = nod_active.father;
        }
        list_way.pop();

        return list_way;
    }
}//

    /**
     * Initializes a matrix to simulate the algorithm.
     * 
     * @param {Number} N 
     * @param {Number} M 
     * @param {Array} l_cls 
     */
    function create_matrix (N, M, l_cls) {

        let m = [];
        let i, j, nod_aux;
        
        for (i = 1; i <= N; ++i)
            for (j = 1; j <= M; ++j) 
                m.push(new Nod(i, j));

        return m;
    }

    /**
     * Expands the active node to the adjacent nodes and calculates their respective parameters.
     * 
     * @param {Nod} nod_active 
     * @param {Object} matrix 
     * @param {Array} list_open 
     * @param {Array} list_close 
     * @param {Nod} nod_fin 
     * @param {Number} N 
     * @param {Number} M
     * 
     */
    function expand(nod_active, matrix, list_open, list_close, nod_fin, N, M) {

        let i, j;
        let nod_ady;

        for (i = -1; i <= 1; ++i)
            for (j = -1; j <= 1; ++j) {

                if ((i != 0 || j != 0) && nod_active.X+i > 0 && nod_active.X+i <= N && nod_active.Y+j > 0 && nod_active.Y+j <= M) {

                    nod_ady = get_nod(matrix, nod_active.X+i, nod_active.Y+j);

                    if (!is_in_list(list_close, nod_ady)) {

                        let new_g = euclid_dist(nod_ady, nod_active) + nod_active.G;

                        if (!is_in_list(list_open, nod_ady)) {

                            nod_ady.father = nod_active;
                            nod_ady.G = new_g;
                            nod_ady.H = euclid_dist(nod_ady, nod_fin);
                            list_open.push(nod_ady);
                        }
                        else if (new_g < nod_ady.G) {

                            nod_ady.father = nod_active;
                            nod_ady.G = new_g;
                        }
                    }
                }
            }
        
        list_close.push(nod_active);
    }

    /**
     * Verify that if a node is in the list.
     * 
     * @param {Array} list 
     * @param {Nod} nod 
     * 
     * @returns Boolean
     */
    function is_in_list(list, nod) { return undefined !== list.find(elem => { return elem.X === nod.X && elem.Y === nod.Y }); }

    /**
     * Verify that two nodes are equal.
     * 
     * @param {Nod} nod1 
     * @param {Nod} nod2 
     * 
     * @returns Boolean
     */
    function are_equal(nod1, nod2) { return nod1.X === nod2.X && nod1.Y === nod2.Y; }

    /**
     * Returns the node of the matrix corresponding to the coordinates passed as a parameter.
     * 
     * @param {Object} matrix 
     * @param {Number} x 
     * @param {Number} y 
     * 
     * @returns Nod
     */
    function get_nod(matrix, x, y) { return matrix.find(elem => { return elem.X === x && elem.Y === y }); }

    /**
     * Calculate the euclidean distance between two nodes of the matrix.
     * 
     * @param {Nod} nod1 
     * @param {Nod} nod2 
     */
    function euclid_dist(nod1, nod2) { return Math.sqrt(Math.pow(nod2.X - nod1.X, 2) + Math.pow(nod2.Y - nod1.Y, 2)); }

  
