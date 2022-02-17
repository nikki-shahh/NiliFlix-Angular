import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() loginData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  //Sends the form to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.loginData).subscribe((result) => {
      console.log(result);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', result.user.Username);
      this.dialogRef.close();
      this.snackBar.open(`${this.loginData.Username} logged in successfully!`,
        'OK',
        {
          duration: 4000,
        });
      this.router.navigate(['movies']);
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 4000
      });
    });
  }

}
