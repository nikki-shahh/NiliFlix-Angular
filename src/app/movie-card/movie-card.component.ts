import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { SynopsisCardComponent } from '../synopsis-card/synopsis-card.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  FavoriteMovies: any[] = [];
  user: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      this.movies = result;
      console.log(this.movies);
      return this.getMovies;
    });
  }
  /**
   * get an array of the user's favorite movies from user's data
   */
  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((result: any) => {
      this.FavoriteMovies = result.FavoriteMovies;
      console.log(this.FavoriteMovies);
    });
  }
  /**
   *open a dialog to display the GenreCardComponent
   * @param name {string}
   * @param description {string}
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: { name: name, description: description },
      width: '300px',
    });
  }

  /**
   * open a dialog to display the DirectorCardComponent
   * @param name {string}
   * @param bio {string}
   * @param birth {string}
   * @param movies {string}
   */
  openDirectorDialog(
    name: string,
    bio: string,
    birth: string,
    movies: any[]
  ): void {
    this.dialog.open(DirectorCardComponent, {
      data: { name: name, bio: bio, birth: birth, movies: movies },
      width: '300px',
    });
  }

  /**
   * open a dialog to display the SynopsisCardComponent
   * @param title {string}
   * @param description {string}
   */
  openSynopsisDialog(
    title: string,
    description: string,
    actors: string,
    release: number,
    rating: number
  ): void {
    this.dialog.open(SynopsisCardComponent, {
      data: { title: title, description: description, actors: actors, release: release, rating: rating },
      width: '300px',
    });
  }

  /**
   * use API end-point to add user favorite movie
   * @function addFavoriteMovie
   * @param MovieID {string}
   * @param title {string}
   * @returns an array of the movie object in json format
   */
  addFavoriteMovie(MovieID: string, title: string): void {
    this.fetchApiData.addFavoriteMovie(MovieID).subscribe((result: any) => {
      this.snackBar.open(`${title} has been added to your favorites!`, 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  /**
   * use API end-point to remove user favorite
   * @function deleteFavoriteMovie
   * @param MovieId {string}
   * @param title {string}
   * @returns updated user's data in json format
   */
  removeFavoriteMovie(MovieId: string, title: string): void {
    this.fetchApiData.deleteFavoriteMovie(MovieId).subscribe((result: any) => {
      console.log(result);
      this.snackBar.open(
        `${title} has been removed from your favorites!`,
        'OK',
        {
          duration: 4000,
        }
      );
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  /**
   * check if the movie is the user's favorite?
   * @param MovieID {string}
   * @returns true or false
   */
  isFavorite(MovieID: string): boolean {
    return this.FavoriteMovies.some((movie) => movie._id === MovieID);
  }

  /**
   * toggle add/remove user's favorite function.
   * if the movie is not on the favorite list, call ...
   * @function addFavoriteMovie
   * if the movie is already on the user favorite list, call ...
   * @function removeFavoriteMovie
   * @param movie {any}
   */
  toggleFavorite(movie: any): void {
    this.isFavorite(movie._id)
      ? this.removeFavoriteMovie(movie._id, movie.Title)
      : this.addFavoriteMovie(movie._id, movie.Title);
  }
}
