import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import store from '../store/store';
import '../style/components/card.styl';
import { prefix } from '../util/prefix';
import { idSanitizer } from '../util/idSanitizer';
import { CARD_STATE, SHOW_DELAY, ACTIVE_CLASS } from '../constants/GameConstants';
import { moveOccured, matchOccurred, noMatchOccurred } from '../actions/CardActions';

class GameCard extends Component {

    static propTypes = {
        cards: PropTypes.array.isRequired,
        id: PropTypes.string.isRequired,
        gameState: PropTypes.object
    }

    handleClick(key, cardState, gameState, cardCount) {

        if (cardState.state === CARD_STATE.SELECTED || this.isMoveInProgress(gameState)) {
            return false;
        }

        if (cardState.lastMove === idSanitizer(key)) {
            console.log(gameState);
            store.dispatch(matchOccurred(key,  gameState.correctMatches, cardCount));
        }

        else if (cardState.moveCount === 1) {
            store.dispatch(moveOccured(key, CARD_STATE.SELECTED, cardState.moveCount));
            setTimeout(store.dispatch.bind(this, noMatchOccurred(gameState, key)), SHOW_DELAY);
        }

        else if (cardState.state === CARD_STATE.UNSELECTED) {
            store.dispatch(moveOccured(key, CARD_STATE.SELECTED, this.incrementCounter(cardState.moveCount)));
        }
    }

    isMoveInProgress(gameState) {
        if (!gameState || !gameState.lastMove) {
            return false;
        }

        const id = idSanitizer(gameState.lastMove);

        return gameState[id] === CARD_STATE.SELECTED;
    }

    incrementCounter(currentCount) {
        return currentCount+= 1;
    }

    getCurrentState(gameState, id, lastMove) {
        if (!gameState) {
            return {
                state: CARD_STATE.UNSELECTED,
                lastMove: null,
                moveCount: null
            };
        }

        if (gameState[id]) {
            return {
                state: gameState[id],
                lastMove: gameState.lastMove,
                moveCount: gameState.moveCount
            };
        }

        else {
            return {
                state: CARD_STATE.UNSELECTED,
                lastMove: gameState.lastMove,
                moveCount: gameState.moveCount
            };
        }
    }

    render() {
        const { value, src, gameState, id, cards } = this.props;
        const cardState = this.getCurrentState(gameState, id);
        const isSelected = cardState.state === CARD_STATE.SELECTED || cardState.state === CARD_STATE.MATCHED;
        const cardCount = cards ? cards.length : 0;

        const cardProps = {
            className: prefix('card'),
            onClick: this.handleClick.bind(this, id, cardState, gameState, cardCount)
        };

        const imgProps = {
            src: isSelected ? `images/cards/${src}` : `images/cards/back.jpeg`,
            className: isSelected ? prefix(ACTIVE_CLASS) : null
        };

        return (
            <div { ...cardProps } >
                <span>
                    <img { ...imgProps } />
                </span>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        cards: state.cards.get('deck'),
        gameState: state.game.get('gameState')
    };
}

export default connect(mapStateToProps)(GameCard);