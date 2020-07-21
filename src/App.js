import React from 'react';
import events from './events';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import _ from 'lodash'
// import * as dates from './utils/dates'
import 'react-big-calendar/lib/css/react-big-calendar.css';


class App extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      events: _.cloneDeep(events),
      dayLayoutAlgorithm: 'no-overlap',
    }
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('일정을 추가하세요')
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
  }

  render() {
    const localizer = momentLocalizer(moment)
    return (
      <>
        <h1>일정관리</h1>
        <Calendar
          selectable
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date()}
          defaultDate={new Date()}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
          dayLayoutAlgorithm={this.state.dayLayoutAlgorithm}
        />
      </>
    )
  }
}



/*
let allViews = Object.keys(Views).map(k => Views[k])

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

const App = props => (
  <div>
    <Calendar
    events={events}
    views={allViews}
    step={60}
    startAccessor="start"
    endAccessor="end"
    components={{
      timeSlotWrapper: ColoredDateCellWrapper,
    }}
    localizer={localizer}
  />
  </div>
)*/


export default App;
