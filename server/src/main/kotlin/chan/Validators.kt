package chan

import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.http.HttpStatus
import chan.orm.Message



@ResponseStatus(value = HttpStatus.BAD_REQUEST)
class MessageValidationException(descr: String): RuntimeException(descr)

fun validateMessage(message: Message) {
	if (message.text.length > 15000 || message.text.length == 0) {
		throw MessageValidationException("Text too long!")
	}

	if (message.media != null && message.media.size > 4) {
		throw MessageValidationException("Too many media files!")
	}

	if (message.author.length > 100) {
		throw MessageValidationException("Author too long!")
	}
}
