import "datejs"

update = (shift, time) ->
  [day, hour, minute] = time.split ":"
  hour = parseInt hour, 10
  minute = parseInt minute, 10

  Date.parse("next #{day}").set({hour, minute})
  .add(shift).hour()
  .toString("ddd:HH:mm")

offset = (shift, range) ->
  [start, end] = range.split "-"
  "#{update shift, start}-#{update shift, end}"

export {offset}
