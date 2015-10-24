'voetbal', 'volleybal', 'korfbal', 'balsport', 'dolvo'

group:
	- type: prefix
	- str: bal
	- words:
		(- voet)
		(- volley)
		- sport
			- position: right
		- korf 
			- position: left
	- groups:
		- str: vo
		- words:
			- et
			- lley

a match must start at the beginning of a word or must end a word


(vo(et|lley)|korf)bal

if a match falls in the middle of a word then that is very tricky

pannenkoek
schoenendoos
(pan|schoen)nen(koek|doos)
pannendoos
schoennenkoek


pannenkoek
schoenen
(pan|schoen)nen(doos?)
pannendoos
schoenendoos
