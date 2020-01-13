package chan

import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import javax.transaction.Transactional
import javax.transaction.Transactional.TxType
import java.util.Base64
import java.security.MessageDigest
import java.util.UUID

import chan.orm.BoardRepository
import chan.orm.MessageRepository
import chan.orm.MediaContentRepository
import chan.orm.Message
import chan.orm.Board
import chan.orm.MediaContent


@ResponseStatus(value = HttpStatus.NOT_FOUND)
class ContentNotFound(value: String): RuntimeException("Conent ${value} not found.")


@Service
class BoardService(
	public val messageRepository: MessageRepository,
	public val boardRepository: BoardRepository,
	public val mediaContentRepository: MediaContentRepository
)  {
	fun getBoardAndBumpMessageCount(shortName: String): Board {
		var board = getBoard(shortName)
		board.messageCount++
		return boardRepository.save(board)
	}

	fun getBoard(shortName: String): Board {
		val board = boardRepository.getByShortName(shortName)
		if (board == null) {
			throw ContentNotFound(shortName)
		}
		return board
	}

	fun getMessage(board: Board, number: Long): Message {
		val message = messageRepository.getByBoardAndNumber(board, number)
		if (message == null) {
			throw ContentNotFound(number.toString())
		}
		return message
	}

	@Transactional
	fun createBoard(name: String, shortName: String, description: String) {
		val board = Board(shortName = shortName, name = name, description = description)

		if (boardRepository.existsByShortName(shortName)) {
			return
		}

		boardRepository.save(board)
	}

	@Transactional
	fun deleteBoard(shortName: String) {
		val board = getBoard(shortName)
		boardRepository.delete(board)
	}

	@Transactional
	fun postMessage(message: Message, boardShortName: String, threadNumber: Long? = null) {
		val board = getBoardAndBumpMessageCount(boardShortName)

		var messageNew = Message(board = board,
			parent = threadNumber?.let { getMessage(board, it) },
			author = message.author,
			text = message.text,
			tripcode = if (message.tripcode.isNullOrEmpty()) "" else
				Base64.getEncoder().encodeToString(
					MessageDigest.getInstance("MD5")
						.digest(message.tripcode.toByteArray())
				),
			media = message.media ?: ArrayList<UUID>()
			)

		messageNew = messageRepository.save(messageNew)

		if (threadNumber == null) {
			return
		}

		// TODO: add replies to all cited messages
		var thread = getMessage(board, threadNumber)
		thread.replies.add(messageNew.number)
		messageRepository.save(thread)
	}

	@Transactional
	fun deleteMessage(boardShortName: String, number: Long) {
		val board = getBoard(boardShortName)

		messageRepository.deleteByBoardAndNumber(board, number)
	}

	fun postContent(image: ByteArray): UUID {
		val content = MediaContent(data = image)
		if (mediaContentRepository.existsByUuid(content.uuid)) {
			return content.uuid
		}
		mediaContentRepository.save(content)

		return content.uuid
	}

	fun getContent(uuid: UUID): ByteArray {
		val result = mediaContentRepository.getByUuid(uuid)
		if (result == null) {
			throw ContentNotFound(uuid.toString())
		}
		return result.data
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
