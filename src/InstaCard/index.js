/** @jsx jsx */
import { Component } from 'react';
import Header from './Header';
import Body from './Body';
import ThemeSwitcher from './ThemeSwitcher';
import CardSwitcher from './CardSwitcher'
import { ReactComponent as LoadingImg } from '../images/loading.svg';
import { fetchData } from '../CardDataUtils';
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled'
import '../index.scss';

const Article = styled.article(
  {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '614px',
    width: '100%',
    border: '1px solid #e6e6e6',
    borderRadius: '5px',
  },
  props => {
    let styles = []
    switch (props.type) {
      case 'dark':
        styles.push({ 
          backgroundColor: '#262626',
          color: '#999',
        })
        break;
      default:
        
    }
    return styles;
  }
)

const loaderWrapperStyle =css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`

const instaCard = css`
  label: insta-card;
  display: flex;
  flex-direction: column;
  max-width: 614px;
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
`

const EmptyBox = () => {
  return (
    <article css={instaCard} style={{ height: 600 }}>
      <div css={loaderWrapperStyle}>
        <LoadingImg />
      </div>
    </article>
  );
}

export default class extends Component {
  state = {
    theme: 'light',
    loading: true,
    loadedOnce: false,
    data: null,
    chosenId: 1
  }

  componentDidMount() {
    fetchData().then((data) => {
      this.setState({ loading: false, data })
    })
  }

  onSwitchTheme = (theme, e = null) => {
    if (e) e.preventDefault();
    this.setState({ theme })
  }

  onSwitchCard = (id, e = null) => {
    if (e) e.preventDefault();
    const { data } = this.state;
    if (!data || data.id === id) return
    this.setState({
      loading: true,
      chosenId: id,
    })
    fetchData(id).then((data) => {
      this.setState({ 
        loading: false, data,
        loadedOnce: true
      })
    })
  }

  render() {
    const { 
      theme, 
      loading, 
      data, 
      chosenId, 
      loadedOnce 
    } = this.state;
    // let instaCardClass = "insta-card";
    let articlePart;
    // if (theme === 'dark') {
    //   instaCardClass = "insta-card insta-card-dark"
    // }
    if (loading && loadedOnce === false) {
      articlePart = <EmptyBox />;
    } else {
      articlePart = (
        <Article type={theme}>
          <Header theme={theme} data={data} />
          <Body theme={theme} data={data} chosenId={chosenId} />
        </Article>
      );
    }
    return (
      <div className="card-wrapper">
        <div style={{ marginBottom: 7 }}>
          <p>- テーマを選択してください。</p>
          <ThemeSwitcher 
            theme={theme}
            switchTheme={this.onSwitchTheme} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <p>- 表示するカードを選択してください。</p>
          <CardSwitcher id={chosenId} switchCard={this.onSwitchCard} />
        </div>
        {articlePart}
      </div>
    );
  }
}