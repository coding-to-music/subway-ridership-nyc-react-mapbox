import React from 'react';
import { Checkbox, Divider, Header, Tab, Dropdown, Modal, Button, Icon, Responsive } from "semantic-ui-react";
import moment from 'moment';

import OverallGraph from './overallGraph';
import DetailsDate from './detailsDate';
import DetailsCompareDates from './detailsCompareDates';
import StationList from './stationList';
import { selectYearOptions } from './utils';

import overall from './data/overall.json';

class OverallDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }
  }

  combinedDetails() {
    const { nyct, sir, rit, pth, jfk, selectedDate, compareWithDate } = this.props;
    const settings = { 'NYCT': nyct, 'SIR': sir, 'RIT': rit, 'PTH': pth, 'JFK': jfk};
    const results = {};
    [selectedDate, compareWithDate].filter((date) => date).forEach((date) => {
      results[date] = {};
      ['entries', 'exits'].forEach((field) => {
        results[date][field] = Object.keys(settings).filter((system) => settings[system]).map((system) => overall[system] && overall[system][date] ? overall[system][date][field] : 0).reduce((acc, cur) => acc + cur, 0);
      });
    })
    return results;
  }

  handleGetWidth = () => {
    return { width: window.innerWidth, height: window.innerHeight };
  };

  handleOnUpdate = (e, { width }) => {
    this.setState(width);
  };

  checkboxes() {
    const { isMobile } = this.props;
    return [
      { label: 'NYCT Subway', field: 'nyct'},
      { label: isMobile ? 'SIR' : 'Staten Island Railway', field: 'sir'},
      { label: isMobile ? 'RIT' : 'Roosevelt Island Tramway', field: 'rit'},
      { label: 'PATH', field: 'pth'},
      { label: 'AirTrain JFK', field: 'jfk'},
    ];
  }

  render() {
    const {
      nyct,
      sir,
      rit,
      pth,
      jfk,
      isMobile,
      selectedDate,
      selectedDateObj,
      compareWithDate,
      compareWithDateObj,
      firstYear,
      lastYear,
      handleSelectStation,
      handleToggle,
      handleGraphClick,
      handleYearChange,
      mode,
    } = this.props;
    const { width, height } = this.state;
    const selectedYear = moment(selectedDate).year();
    const data = this.combinedDetails();
    return (
      <div className='overall-details'>
        {
          this.checkboxes().map((c) => {
            return (
              <Checkbox label={c.label} name={c.field} checked={this.props[c.field]} key={c.field} onChange={handleToggle} />
            )
          })
        }
        <Divider className='tab-separator' />
        <Tab menu={{secondary: true, pointing: true}} panes={
          [
            {
              menuItem: 'Overall',
              render: () => {
                return (
                  <Tab.Pane attached={false}>
                    { compareWithDate ?
                      <DetailsCompareDates isMobile={isMobile}
                        selectedDate={selectedDate} selectedDateObj={data[selectedDate]}
                        compareWithDate={compareWithDate} compareWithDateObj={data[compareWithDate]}
                      /> :
                      <DetailsDate isMobile={isMobile} data={data[selectedDate]} selectedDate={selectedDate} />
                    }
                  </Tab.Pane>
                )
              },
            },
            {
              menuItem: 'Stations',
              render: () => {
                return (
                  <Tab.Pane attached={false}>
                    <StationList nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} mode={mode}
                      selectedDate={selectedDate} selectedDateObj={selectedDateObj}
                      compareWithDate={compareWithDate} compareWithDateObj={compareWithDateObj}
                      handleSelectStation={handleSelectStation} />
                  </Tab.Pane>
                )
              },
            },
          ]
        }/>
        <Divider horizontal>
          <Header size='medium' className='details-graph-header'>
            <div>
              Daily Counts in&nbsp;
            </div>
            <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
            <Modal trigger={<div className='icon-container'><Icon name='external' size='small' title='Expand graph' link /></div>} size='fullscreen' closeIcon>
              <Modal.Header>
                Daily Counts in&nbsp;
                <Dropdown inline options={selectYearOptions(firstYear, lastYear)} value={selectedYear} selectOnNavigation={false} onChange={handleYearChange} />
              </Modal.Header>
              <Responsive as={Modal.Content} getWidth={this.handleGetWidth} onUpdate={this.handleOnUpdate} fireOnMount>
                <OverallGraph isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} handleGraphClick={handleGraphClick} selectedYear={selectedYear} width={width} height={height} />
              </Responsive>
            </Modal>
          </Header>
        </Divider>
        <div>
          <OverallGraph isMobile={isMobile} nyct={nyct} sir={sir} rit={rit} pth={pth} jfk={jfk} handleGraphClick={handleGraphClick} selectedYear={selectedYear} />
         </div>
      </div>
    )
  }
}

export default OverallDetails;