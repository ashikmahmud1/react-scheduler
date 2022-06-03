import './index.css';
import * as React from 'react';
import { WorkWeek, Month, ScheduleComponent, ViewsDirective, ViewDirective, ResourcesDirective, ResourceDirective, Inject } from '@syncfusion/ej2-react-schedule';
import { addClass } from '@syncfusion/ej2-base';

import { extend } from '@syncfusion/ej2-base';
import { SampleBase } from './SampleBase';
import  {dataSource} from './datasource.js';
/**
 * schedule resources group-custom-work-days sample
 */
export class WorkDays extends SampleBase {
    scheduleObj;
    data = extend([], dataSource.doctorData, null, true);
    resourceData = [
        { text: 'Will Smith', id: 1, color: '#ea7a57', workDays: [0, 1, 2, 3, 4, 5, 6], startHour: '08:00', endHour: '23:59' }
    ];
    getDoctorImage(value) {
        return this.getDoctorName(value).replace(' ', '-').toLowerCase();
    }
    getDoctorName(value) {
        return ((value.resourceData) ?
            value.resourceData[value.resource.textField] :
            value.resourceName);
    }
    getDoctorLevel(value) {
        let resourceName = this.getDoctorName(value);
        return (resourceName === 'Will Smith') ? 'Cardiologist' : (resourceName === 'Alice') ? 'Neurologist' : 'Orthopedic Surgeon';
    }
    onActionBegin(args) {
        let isEventChange = (args.requestType === 'eventChange');
        if ((args.requestType === 'eventCreate' && args.data.length > 0) || isEventChange) {
            let eventData = (isEventChange) ? args.data : args.data[0];
            console.log(eventData);
            let eventField = this.scheduleObj.eventFields;
            let startDate = eventData[eventField.startTime];
            let endDate = eventData[eventField.endTime];
            let resourceIndex = [1, 2, 3].indexOf(eventData.DoctorId);
            args.cancel = !this.isValidTime(startDate, endDate, resourceIndex);
            if (!args.cancel) {
                args.cancel = !this.scheduleObj.isSlotAvailable(startDate, endDate, resourceIndex);
            }
        }
    }
    isValidTime(startDate, endDate, resIndex) {
        let resource = this.scheduleObj.getResourcesByIndex(resIndex);
        let startHour = parseInt(resource.resourceData.startHour.toString().slice(0, 2), 10);
        let endHour = parseInt(resource.resourceData.endHour.toString().slice(0, 2), 10);
        return (startHour <= startDate.getHours() && endHour >= endDate.getHours());
    }
    onPopupOpen(args) {
        if (args.target && args.target.classList.contains('e-work-cells')) {
            args.cancel = !args.target.classList.contains('e-work-hours');
        }
    }
    onRenderCell(args) {
        if (args.element.classList.contains('e-work-hours') || args.element.classList.contains('e-work-cells')) {
            addClass([args.element], ['willsmith', 'alice', 'robson'][parseInt(args.element.getAttribute('data-group-index'), 10)]);
        }
    }
    resourceHeaderTemplate(props) {
        return (<div className="template-wrap"><div className={"resource-image " + this.getDoctorImage(props)}></div>
      <div className="resource-detail"><div className="resource-name">{this.getDoctorName(props)}</div>
        <div className="resource-designation">{this.getDoctorLevel(props)}</div></div></div>);
    }
    render() {
        return (<div className='schedule-control-section'>
        <div className='col-lg-12 control-section'>
          <div className='control-wrapper'>
            <ScheduleComponent ref={schedule => this.scheduleObj = schedule} cssClass='custom-work-days' width='100%' height='650px' selectedDate={new Date(2021, 3, 6)} currentView='WorkWeek' resourceHeaderTemplate={this.resourceHeaderTemplate.bind(this)} eventSettings={{
                dataSource: this.data,
                fields: {
                    subject: { title: 'Service Type', name: 'Subject' },
                    location: { title: 'Patient Name', name: 'Location' },
                    description: { title: 'Summary', name: 'Description' },
                    startTime: { title: 'From', name: 'StartTime' },
                    endTime: { title: 'To', name: 'EndTime' }
                }
            }} actionBegin={this.onActionBegin.bind(this)} popupOpen={this.onPopupOpen.bind(this)} renderCell={this.onRenderCell.bind(this)} group={{ resources: ['Doctors'] }}>
              <ResourcesDirective>
                <ResourceDirective field='DoctorId' title='Doctor Name' name='Doctors' dataSource={this.resourceData} textField='text' idField='id' groupIDField='groupId' colorField='color' workDaysField='workDays' startHourField='startHour' endHourField='endHour'>
                </ResourceDirective>
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option='WorkWeek'/>
                <ViewDirective option='Month'/>
              </ViewsDirective>
              <Inject services={[WorkWeek, Month]}/>
            </ScheduleComponent>
          </div>
        </div>
      </div>);
    }
}