package chan

import chan.orm.BoardRepository
import chan.orm.MessageRepository
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import javax.transaction.Transactional
import javax.transaction.Transactional.TxType
import chan.orm.Message
import chan.orm.Board



@ResponseStatus(value = HttpStatus.NOT_FOUND)
class MessageNotFound(id: Long): RuntimeException("Post №${id} not found.")

@ResponseStatus(value = HttpStatus.NOT_FOUND)
class BoardNotFound(shortName: String): RuntimeException("Board ${shortName} not found.")

@Service
class BoardService(
	public val messageRepository: MessageRepository,
	public val boardRepository: BoardRepository
)  {
	fun getBoardAndBumpMessageCount(shortName: String): Board {
		var board = getBoard(shortName)
		board.messageCount++
		return boardRepository.save(board)
	}

	fun getBoard(shortName: String): Board {
		val board = boardRepository.getByShortName(shortName)
		if (board == null) {
			throw BoardNotFound(shortName);
		}
		return board;
	}

	fun getMessage(board: Board, number: Long): Message {
		val message = messageRepository.getByBoardAndNumber(board, number)
		if (message == null) {
			throw MessageNotFound(number)
		}
		return message
	}

	@Transactional
	fun postMessage(message: Message, boardShortName: String, threadNumber: Long? = null) {
		val board = getBoardAndBumpMessageCount(boardShortName)
		val messageNew = Message(board = board,
			parent = threadNumber?.let { getMessage(board, it) },
			author = message.author,
			text = message.text)
		messageRepository.save(messageNew)
	}

	@Transactional
	fun getThreadMessages(boardShortName: String, threadNumber: Long): List<Message> {
		val board = getBoard(boardShortName)
		val oppost = getMessage(board, threadNumber)
		var messages = messageRepository.getByBoardAndParent(board, oppost)
		var result = ArrayList<Message>()
		result.add(oppost)
		result.addAll(messages)
		return result
	}

	@Transactional
	fun getBoardThreads(boardShortName: String): List<Message> {
		return messageRepository.getByBoardAndParent(getBoard(boardShortName), null)
	}
}
