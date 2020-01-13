package chan

import org.springframework.web.bind.annotation.*
import com.fasterxml.jackson.databind.ObjectMapper
import java.util.UUID
import java.io.InputStream

import chan.BoardService
import chan.orm.Board
import chan.orm.Message
import chan.validateMessage
import java.util.Base64


@RestController
@RequestMapping("/api")
class BoardController(
	val boardService: BoardService
) {
	private val jsonMapper = ObjectMapper();

	init {
		boardService.boardRepository.save(Board(shortName = "a",
			name = "Раздел А",
			description = "Не очень загадочный раздел"))
		boardService.boardRepository.save(
			Board(shortName = "b",
			name = "Раздел B",
			description = "Загадочный раздел"))
	}

	@PostMapping("/postMessage")
	fun postMessage(
		@RequestParam("board") board: String,
		@RequestParam("thread") thread: Long,
		@RequestBody message: String
	) {
		val messageObj = jsonMapper.readValue(message, Message::class.java)
		validateMessage(messageObj)
		boardService.postMessage(messageObj, board, thread)
	}

	@PostMapping("/postThread")
	fun postThread(
		@RequestParam("board") board: String,
		@RequestBody message: String
	) {
		val messageObj = jsonMapper.readValue(message, Message::class.java)
		validateMessage(messageObj)
		boardService.postMessage(messageObj, board)
	}

	@GetMapping("/getThreadMessages")
	fun getThreadMessages(
		@RequestParam("board") board: String,
		@RequestParam("thread") thread: Long
	): String {
		return jsonMapper.writeValueAsString(boardService.getThreadMessages(board, thread));
	}

	@GetMapping("/getBoardThreads")
	fun getBoardThreads(
		@RequestParam("board") board: String
	): String {
		return jsonMapper.writeValueAsString(boardService.getBoardThreads(board));
	}

	@GetMapping("/getBoards")
	fun getBoards(): String {
		return jsonMapper.writeValueAsString(boardService.boardRepository.findAll())
	}

	@PostMapping("/postContent")
	fun postContent(@RequestBody data: ByteArray): String {
		return boardService.postContent(data).toString()
	}

	@GetMapping("/getContent")
	fun getContent(@RequestParam("uuid") uuid: UUID): ByteArray {
		return boardService.getContent(uuid)
	}
}