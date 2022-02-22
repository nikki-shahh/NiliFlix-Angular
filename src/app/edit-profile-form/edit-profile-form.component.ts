
/*
*EditProfileFormComponent view lets the user edit their profile information
 * @module EditProfileFormComponent
 */
import { Component, OnInit, Input, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss'],
})
export class EditProfileFormComponent implements OnInit {
  Username = localStorage.getItem('user');
  user: any = {};

  /**
   *  Binding input values to userProfile object
   */
  @Input() userProfile = {
    Username: this.user.Username,
    Password: '',
    Email: this.user.Email,
    Birthday: this.user.Birthday,
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<EditProfileFormComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: { onSuccess: () => void },
  ) { }

  ngOnInit(): void {
  }

  /**
   * updates the user information in API
   * @function editUser
   * @param Username {any}
   * @param userProfile {any}
   * @return an updated user in json format
   * then stores it in localstorage. a popup message is displayed after successful updated
   */
  editUser(): void {
    this.fetchApiData
      .editUser(this.user.Username, this.userProfile)
      .subscribe((resp) => {
        this.dialogRef.close();
        window.location.reload();
        localStorage.setItem('user', JSON.stringify(resp));
        console.log(this.user);
        this.snackBar.open('Your profile was updated successfully!', 'OK', {
          duration: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  }
}