import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FunctionalDescService } from '../../../../data-services/functional-desc.services';
import { UserStoryServices } from '../../../../data-services/userStory.services'
import { routerTransition } from '../../../../router.animations';
import { FunctionalDesc } from '../../../../model/functionalDesc.model';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss'],
  animations: [routerTransition()]
})

export class FunctionsComponent implements OnInit {

  display = 'none';
  modal: any;
  backlog: any;
  functionForm: FormGroup;
  selectedData: FunctionalDesc;
  columnFilter: string = 'name';
  functionsList: FunctionalDesc[];
  searchString: string = '';

  constructor(private functionsService: FunctionalDescService, private form: FormBuilder, private userSrv: UserStoryServices) {
    this.functionForm = this.form.group({
      'functionDesc': new FormControl(null, Validators.required),
      'code': new FormControl(null,Validators.required)
    });
  }

  ngOnInit() {
    this.loadData();
  }

  onModalOpen(modalName: string, selectedData?: FunctionalDesc) {
    this.modal = modalName;
    this.display = 'block';
    console.log('selectedData', selectedData);
    if (selectedData) {
      this.selectedData = selectedData;
      this.functionForm = this.form.group({
        //'id': [this.selectedData.id, Validators.required],
        'functionDesc': new FormControl(this.selectedData.functionDesc, Validators.required),
        'code': new FormControl(this.selectedData.code,Validators.required)
      });
    } else {
      this.selectedData = new FunctionalDesc(null, null, null);
    }
  }

  onSubmitAdd() {
    let newFunction = new FunctionalDesc(
      this.functionsService.generateID(),
      this.functionForm.controls.code.value,
      this.functionForm.controls.functionDesc.value
    );
    this.functionsService.saveFunction(newFunction);
    this.loadData();
    this.onModalClose();
  }

  onSubmitEdit() {
    this.functionsService.editFunction(new FunctionalDesc(this.selectedData.id, this.functionForm.controls.functionDesc.value, this.functionForm.controls.code.value));
    this.loadData();
    this.onModalClose();
  }

  loadData() {
    this.backlog = this.userSrv.getUserStory();
    this.functionsList = this.functionsService.getFunctions();
  }

  onModalClose() {
    this.display = 'none';
    this.functionForm.reset();
  }

}
