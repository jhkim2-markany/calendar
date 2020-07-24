import React from 'react';
import events from './events';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/ko'
import _ from 'lodash'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'


import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

moment.locale("ko")



const DragAndDropCalendar = withDragAndDrop(Calendar)

//-------------------------------------------------
//일정에서 이벤트줌 => 호버하면 될듯?
function Event({ event }) {
  return (
    <span>
      <strong>{event.title}</strong>
      <p>{event.desc && ' : ' + event.desc}</p>  
    </span>
  )           //마우스 오버하기
}

//Agenda에서 이벤트 주는거
function EventAgenda({ event }) {
  return (
    <span>
      <em style={{ color: 'magenta' }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  )
}

//----------------------------------------------
class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      events: _.cloneDeep(events),
      dayLayoutAlgorithm: 'no-overlap',
      displayDragItemInCell: true,
    }
    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.handleSelect.bind(this)
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('일정을 추가하세요')
    const desc = window.prompt("내용을 추가하세요")
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
            desc
          },
        ],
      })
  }

  handleDragStart = event => {
    this.setState({ draggedEvent: event })
  }

  dragFromOutsideItem = () => {
    return this.state.draggedEvent
  }

  onDropFromOutside = ({ start, end, allDay }) => {
    const { draggedEvent } = this.state

    const event = {
      title: draggedEvent.title,
      start,
      end,
      allDay: allDay,
    }

    this.setState({ draggedEvent: null })
    this.moveEvent({ event, start, end })
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state

    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const nextEvents = events.map(existingEvent => {
      return existingEvent.title === event.title
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      console.log(existingEvent);
      console.log(event.title);

      return existingEvent.title === event.title
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }


  onSelectEvent(pEvent) {
    const r = window.confirm("일정을 취소합니다.")
    if(r === true){
      this.setState((prevState, props) => {
        const events = [...prevState.events]
        const idx = events.indexOf(pEvent)
        events.splice(idx, 1);
        return { events };
      });
    }
  }

//업데이트 만들기
handleUpdate = ({ start, end }) => {
  const title = window.prompt('일정을 수정하세요')
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
        <DragAndDropCalendar
          style={{ height: 800 ,width: '100%' }}
          popup={true}                            //popup 만들어주는거 넘어갓을 때
          selectable={true}                              //**선택할수 있게 만들어줌
          localizer={localizer}                                     //moment 모듈을 이용한 로컬화
          events={this.state.events}                                //이벤트 나오게 하는거
          defaultView={Views.Month}                                  //디폴트 뷰
          // scrollToTime={new Date()}                               //**스크롤 시작 위치를 정해줌(안해줘도 될듯)
          defaultDate={moment().toDate()}                           //디폴트 날짜
          onSelectSlot={ this.handleSelect}                          //**날짜 선택시 콜백이 발생한다 -> 위에서 만들어준 handleSelect가 실행
          dayLayoutAlgorithm={this.state.dayLayoutAlgorithm}        //레이아웃 배열의 알고리즘

          onEventDrop={this.moveEvent}
          onEventResize={this.resizeEvent}
        // onDragStart={console.log}                                //콘솔로그 찍히는거 드래그 시작할 떄
        //   dragFromOutsideItem={
        //   this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
        // }
          


        onDropFromOutside={this.onDropFromOutside}
        handleDragStart={this.handleDragStart}
        
        
        tooltipAccessor={this.state.events.start}                 //작동안됌


        onDoubleClickEvent = { event => this.onSelectEvent(event) } //**날자 말고 일정 더블클릭으로 업데이트 해보기
      

      components={{
        event: Event,   //여기서 호버줘야함
        agenda: {
          event: EventAgenda,
        },
      }}

        />
      </>
    )
  }
}



export default App;
