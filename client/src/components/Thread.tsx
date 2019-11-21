import React from 'react'
import Message from './Message'
import MessageEntity from '../state/Message'

const Thread: React.StatelessComponent<MessageEntity[]> = (entity: MessageEntity[]) => {
	// var messages = entity.map(Message);
	return (
		<div className="thread">
		</div>
	);
};

export default Thread
