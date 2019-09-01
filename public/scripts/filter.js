

const filters = (function(){
    const pub = {};
    const filters = {
        filters: null,
        year: null,
        text: null
    };

    pub.initFilters = function(f) {
        filters.filters = f;
    };

    pub.isActive = function(category, filter){
        return filters.filters[category][filter];
    };

    pub.wasPressed = function(category, filter){
        filters.filters[category][filter] = !filters.filters[category][filter];
    };

    pub.setYear = function(value){
        filters.year = value;
    };

    pub.setText = function(value){
        filters.text = value.toLowerCase();
    };

    pub.executeFilter = function(paper){

        //todo: compare search string with citation, however, citation-js seems not to work on the client side
        //const Cite = require('citation-js');
        //const citation = new Cite(paper.bibtex).format('bibliography', {
        //    format: 'text',
        //    template: 'apa',
        //    lang: 'en-US'
        //});


        //filter by text search
        let keep_by_search = true;
        if(filters.text){
            keep_by_search = false;
            if(paper.title.toLowerCase().includes(filters.text))
                keep_by_search = true;
            if(paper.authors.toLowerCase().includes(filters.text))
                keep_by_search = true;
            if(paper.year.toString().includes(filters.text))
                keep_by_search = true;
            if(paper.bibtex.toLowerCase().includes(filters.text))
                keep_by_search = true;
        }


        //filter by filter buttons
        let keep_by_filters = true;
        Object.keys(filters.filters).forEach(function(category){
            let category_represented = false;
            let filters_active = false;
            Object.keys(filters.filters[category]).forEach(function(filter){
                if(pub.isActive(category, filter)){
                    filters_active = true;
                    if(paper.filters.includes(filter))
                        category_represented = true;
                }
            });
            if(filters_active)
                keep_by_filters = category_represented && keep_by_filters;
        });


        //filter by year
        let keep_by_year = filters.year[0] <= paper.year && paper.year <= filters.year[1];


        return keep_by_search && keep_by_year && keep_by_filters;
    };

    return pub;
}());