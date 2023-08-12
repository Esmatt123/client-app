import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Book, Quote } from "src/app/models/book.model";
import { BookService } from "src/app/services/book.service";
import { AddBookFormComponent } from "../book-form/add-book-form/add-book-form.component";

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})

export class BookListComponent implements OnInit {
  books: Book[] = [];
  editModal: boolean = false;
  selectedBookForEdit: Book | null = null;
  selectedBookForQuotes: Book | null = null;
  addingBook: boolean = false;
  @ViewChild(AddBookFormComponent) private addBookFormComponent!: AddBookFormComponent;

  constructor(private bookService: BookService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
  });
  }

  toggleEditModal(book: Book) {
    if (this.selectedBookForEdit === book) {
      this.selectedBookForEdit = null;
      
    } else {
      this.selectedBookForEdit = book;
    }
  }
  
  openEditModal(book: Book) {
    this.selectedBookForEdit = book;
  }
  
  closeEditModal() {
    this.selectedBookForEdit = null;
  }

  deleteBook(book: Book) {
    this.bookService.deleteBook(book).subscribe({
      next: () => {
        console.log('Book deleted:', book.id);
        this.loadBooks();
      },
      error: (error) => {
        console.error('Error deleting book:', error);
      }
    });
  }

  toggleQuotes(book: Book) {
    book.quotesVisible = !book.quotesVisible;
  }

  handleSave(updatedBook: Book) {
    this.bookService.updateBook(updatedBook).subscribe({
      next: () => {
        console.log('Book updated in the database:', updatedBook);
  
        // Assuming you want to update the books list and close the modal
        this.loadBooks(); // Update the books list with fresh data
        this.closeEditModal(); // Close the modal
      },
      error: (error) => {
        console.error('Error updating book:', error);
      }
  });
  } 

  toggleQuoteIsFavourite(quote: Quote) {
    this.bookService.toggleIsQuoteFavourite(quote).subscribe({
      next: () => {
        console.log('Quote isFavourite updated in API');
      },
      error: (error) => {
        console.error('Error updating quote isFavourite in API:', error);
        // Handle the error as needed
      }
  });
  }
  
  toggleAddBookForm() {
    this.addingBook = !this.addingBook;
  }

  onBookAdded(newBook: Book) {
    // Add the new book to the books array
    console.log('New Book received in BookListComponent:', newBook);
    this.books.push(newBook);
  }
  
}
