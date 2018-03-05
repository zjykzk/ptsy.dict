package dict

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSimpleDict(t *testing.T) {
	d := &SimpleDict{words: make([]Word, 0, 32)}

	t.Run("add", func(t *testing.T) {
		d.Add(&Word{Ch: "ch", En: "en"})
		assert.Equal(t, 1, len(d.words))
		assert.Equal(t, int32(0), d.words[0].ID)
		d.Add(&Word{Ch: "ch", En: "en"})
		assert.Equal(t, 2, len(d.words))
		assert.Equal(t, int32(1), d.words[1].ID)
	})

	t.Run("update", func(t *testing.T) {
		d.words = nil
		d.Add(&Word{Ch: "ch", En: "en"})
		d.Add(&Word{Ch: "ch", En: "en"})

		w := &d.words[1]

		w.Examples = "examples"
		err := d.Update(w)
		assert.Nil(t, err)

		assert.Equal(t, "examples", d.words[1].Examples)

		w.ID = -1
		err = d.Update(w)
		assert.NotNil(t, err)
	})

	t.Run("delete", func(t *testing.T) {
		d.words = nil
		d.Add(&Word{Ch: "ch", En: "en"})
		d.Add(&Word{Ch: "ch", En: "en"})
		d.Add(&Word{Ch: "ch", En: "en"})

		err := d.Delete(1)
		assert.Nil(t, err)
		assert.Equal(t, 2, len(d.words))
		assert.Equal(t, int32(0), d.words[0].ID)
		assert.Equal(t, int32(2), d.words[1].ID)
		err = d.Delete(1)
		assert.NotNil(t, err)
	})

	t.Run("search", func(t *testing.T) {
		d.words = nil
		d.Add(&Word{Ch: "a1"})
		d.Add(&Word{En: "b1"})
		d.Add(&Word{Examples: "c1"})
		d.Add(&Word{Source: "d1"})
		d.Add(&Word{Origin: "e1"})
		d.Add(&Word{Position: "f1"})
		d.Add(&Word{Comment: "g1"})

		ws, err := d.Search("1")
		assert.Nil(t, err)
		assert.Equal(t, 7, len(ws))

		for i := range ws {
			w := ws[i]
			assert.Equal(t, int32(i), w.ID)
		}

		ws, err = d.Search("a")
		assert.Nil(t, err)
		assert.Equal(t, 1, len(ws))
		assert.Equal(t, int32(0), ws[0].ID)

		ws, err = d.Search("g1")
		assert.Nil(t, err)
		assert.Equal(t, 1, len(ws))
		assert.Equal(t, int32(6), ws[0].ID)
	})

	t.Run("find", func(t *testing.T) {
		d.words = nil
		d.Add(&Word{Ch: "a1", Origin: "e"})
		d.Add(&Word{En: "b1"})
		d.Add(&Word{Examples: "c1"})
		d.Add(&Word{Source: "d1"})
		d.Add(&Word{Ch: "e1", Origin: "e1"})
		d.Add(&Word{Position: "f1"})
		d.Add(&Word{Comment: "g1"})

		ws, total, _ := d.Find(&Word{Ch: "1", Origin: "e"}, 1, 2)
		assert.Equal(t, 7, total)
		assert.Equal(t, 1, len(ws))
		assert.Equal(t, int32(4), ws[0].ID)

		ws, total, _ = d.Find(&Word{Ch: "1", Origin: "e"}, 2, 2)
		assert.Equal(t, 7, total)
		assert.Equal(t, 0, len(ws))
	})

	t.Run("start shutdown", func(t *testing.T) {
		fn := "test_start"
		ioutil.TempFile("", fn)
		defer os.Remove(fn)

		ioutil.WriteFile(fn, []byte(`[{"ch":"c","en":"en"},{"ch":"c1"}]`), os.ModePerm)

		d := &SimpleDict{filename: fn}
		d.Start()
		assert.Equal(t, 2, len(d.words))

		assert.Equal(t, "c", d.words[0].Ch)
		assert.Equal(t, "en", d.words[0].En)
		assert.Equal(t, "c1", d.words[1].Ch)

		d.Add(&Word{Ch: "c3"})

		d.Shutdown()

		data, err := ioutil.ReadFile(fn)
		var ws []Word
		err = json.Unmarshal(data, &ws)
		assert.Nil(t, err)

		assert.Equal(t, 3, len(ws))
	})
}
