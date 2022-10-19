{
  'use strict';

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      images: '.book__image',
      filters: '.filters',
    },
  };

  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class BooksList {
    constructor(){
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initAction();
      thisBooksList.filterBooks();
      thisBooksList.determineRatingBgc();
    }

    initData(){
      this.data = dataSource.books;      
    }

    getElements(){
      const thisBooksList = this;

      thisBooksList.booksContainer = document.querySelector(select.containerOf.booksList);
      thisBooksList.filter = document.querySelector(select.containerOf.filters);
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
    }

    render(){
      const thisBooksList = this;

      for (let book of dataSource.books){
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        
        book.ratingBgc = ratingBgc;
        book.ratingWidth = ratingWidth;

        const generatedHTML = templates.bookTemplate(book);

        thisBooksList.element = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.booksContainer.appendChild(thisBooksList.element);
      }
    }

    initAction(){
      const thisBooksList = this;

      thisBooksList.booksContainer.addEventListener('dblclick', function(event){

        event.preventDefault();

        const image = event.target.offsetParent;
        const bookId = image.getAttribute('data-id');
    
                
        if(event.target.offsetParent.classList.contains('book__image')) {           
          if(!thisBooksList.favoriteBooks.includes(bookId)){
            thisBooksList.favoriteBooks.push(bookId);
            image.classList.add('favorite');

          } else {
            const indexOfBookId = thisBooksList.favoriteBooks.indexOf(bookId);
            thisBooksList.favoriteBooks.splice(indexOfBookId, 1);
            image.classList.remove('favorite');
          }
        }
      });

      thisBooksList.filter.addEventListener('click', function(callback){

        const clickedFilter = callback.target;

        if(clickedFilter.tagName == 'INPUT' && clickedFilter.type == 'checkbox' && clickedFilter.name == 'filter'){
          if(clickedFilter.checked) {
            thisBooksList.filters.push(clickedFilter.value);
          } else {
            const indexOfFilter = thisBooksList.filters.indexOf(clickedFilter.value);
            thisBooksList.filters.splice(indexOfFilter, 1);
          }
        }
        thisBooksList.filterBooks();
      });
    }

    filterBooks(){
      const thisBooksList = this;

      for(let book of thisBooksList.data){

        let shouldBeHidden = false;
        thisBooksList.bookImage = document.querySelector('.book__image[data-id="'+ book.id +'"]');

        for(const filter of thisBooksList.filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }

        if(shouldBeHidden){
          thisBooksList.bookImage.classList.add('hidden');
        } else {
          thisBooksList.bookImage.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {
      let background = '';

      if(rating < 6){
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8){
        background = 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if (rating > 8 && rating <= 9){
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }else if (rating > 9){
        background = 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }

      return background;
    }
  }
  new BooksList();
}

