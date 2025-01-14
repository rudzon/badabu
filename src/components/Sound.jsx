import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 50%;
  padding: 16px;

  @media (min-width: 320px) {
    width: calc(100% / 3);
  }
  @media (max-width: 480px) {
    padding: 8px;
  }
  @media (min-width: 768px) {
    width: calc(100% / 4);
  }
  @media (min-width: 992px) {
    width: calc(100% / 6);
  }
`
const SquareBox = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
`
const AudioBox = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  background-image: url(${({ cover }) => cover ? `sounds/${cover}` : 'placeholder.png'});
  background-size: cover;
  border: 2px solid ${props => props.isPlaying ? '#3d8681' : '#332c33'};
  cursor: pointer;
`
const Title = styled.span`
  font-size: 14px;
`
const Progress = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 4px;
  background-color: #e94c3d;

  transform: translateY(${({ isPlaying }) => isPlaying ? 0 : '100%'});
  transition: transform 100ms ease-in-out;
  will-change: transform;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scaleX(${props => props.position});
    transform-origin: left;
    background-color: #eee483;
  }
`

export default class Sound extends PureComponent {
  audioRef = React.createRef()
  requestId = React.createRef()

  state = {
    position: 0,
  }

  componentDidMount () {
    const { id, setAudioRef } = this.props
    setAudioRef(id, this.audioRef.current)

    this.audioRef.current.addEventListener('ended', () => {
      this.requestId.current = null
      this.props.stopSound()
    })
  }

  componentDidUpdate () {
    if (this.props.isPlaying) {
      this.requestId.current = window.requestAnimationFrame(this.startAnimation)
    } else {
      this.requestId.current = null
      this.setState({ position: 0 })
    }
  }

  startAnimation = () => {
    const { currentTime, duration } = this.audioRef.current

    this.setState({ position: (currentTime / duration).toFixed(2) })

    if (this.requestId.current) {
      this.requestId.current = window.requestAnimationFrame(this.startAnimation)
    }
  }

  handleClick = () => {
    this.props.playSound(this.props.id)
  }

  render () {
    const { filename, cover, title, isPlaying } = this.props
    const { position } = this.state

    return (
      <Wrapper>
        <SquareBox>
          <AudioBox
            onClick={this.handleClick}
            isPlaying={isPlaying}
            cover={cover}
          >
            {title && <Title>{title}</Title>}
            <Progress position={position} isPlaying={isPlaying} />
            <audio
              ref={this.audioRef}
              src={`sounds/${filename}`}
              preload='metadata'
            />
          </AudioBox>
        </SquareBox>
      </Wrapper>
    )
  }
}
