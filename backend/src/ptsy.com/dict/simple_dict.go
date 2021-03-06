package dict

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

// Word the item in the dict
type Word struct {
	ID       int32  `json:"id"`
	Ch       string `json:"ch"`
	En       string `json:"en"`
	Examples string `json:"examples"`
	Source   string `json:"source"`
	Origin   string `json:"origin"`
	Position string `json:"Position"`
	Comment  string `json:"Comment"`
}

// SimpleDict the simplest implemation of the dict
type SimpleDict struct {
	sync.RWMutex
	words    []Word
	filename string
	logger   *log.Logger

	wg       sync.WaitGroup
	state    int32
	exitChan chan struct{}
}

// Add add one word
func (d *SimpleDict) Add(word *Word) error {
	d.Lock()
	id := int32(0)
	if len(d.words) > 0 {
		id = d.words[len(d.words)-1].ID + 1
	}
	word.ID = id
	d.words = append(d.words, *word)
	d.Unlock()
	d.markModified()

	return nil
}

// Update update one word
func (d *SimpleDict) Update(word *Word) (err error) {
	d.Lock()
	i, exist := d.findIndex(word.ID)
	if !exist {
		err = ErrNoWord
		goto END
	}
	d.words[i] = *word
END:
	d.Unlock()
	if exist {
		d.markModified()
	}
	return
}

// Search search the words
func (d *SimpleDict) Search(keyword string) ([]*Word, error) {
	words := make([]*Word, 0, 32)
	d.RLock()
	for i := range d.words {
		w := &d.words[i]
		if strings.Contains(w.Ch, keyword) || strings.Contains(w.Comment, keyword) ||
			strings.Contains(w.En, keyword) || strings.Contains(w.Examples, keyword) ||
			strings.Contains(w.Origin, keyword) || strings.Contains(w.Position, keyword) ||
			strings.Contains(w.Source, keyword) {
			words = append(words, w)
		}
	}
	d.RUnlock()
	return words, nil
}

// Delete delete one word
func (d *SimpleDict) Delete(id int32) (err error) {
	d.Lock()
	i, exist := d.findIndex(id)
	if !exist {
		err = ErrNoWord
		goto END
	}

	copy(d.words[i:], d.words[i+1:])
	d.words = d.words[:len(d.words)-1]

END:
	d.Unlock()
	if exist {
		d.markModified()
	}
	return
}

// Find returns the words satify the conditions
func (d *SimpleDict) Find(w *Word, offset, limit int) ([]*Word, int, error) {
	total, ws := 0, make([]*Word, 0, limit)

	for i := range d.words {
		wi := &d.words[i]
		if strings.Contains(wi.Ch, w.Ch) &&
			strings.Contains(wi.Comment, w.Comment) &&
			strings.Contains(wi.En, w.En) &&
			strings.Contains(wi.Examples, w.Examples) &&
			strings.Contains(wi.Origin, w.Origin) &&
			strings.Contains(wi.Position, w.Position) &&
			strings.Contains(wi.Source, w.Source) {
			total++
			if offset <= 0 && len(ws) < limit {
				ws = append(ws, wi)
			} else {
				offset--
			}
		}
	}

	return ws, total, nil
}

// Start starts the dict
func (d *SimpleDict) Start() error {
	if _, err := os.Stat(d.filename); os.IsNotExist(err) {
		return nil
	}

	data, err := ioutil.ReadFile(d.filename)
	if err != nil {
		return err
	}

	err = json.Unmarshal(data, &d.words)
	if err != nil {
		return err
	}

	go func() {
		ticker := time.NewTicker(time.Minute)
		d.wg.Add(1)
		for {
			select {
			case <-d.exitChan:
				ticker.Stop()
				d.dump()
				d.wg.Done()
				return
			case <-ticker.C:
				d.dump()
			}
		}
	}()
	return nil
}

// Shutdown shutdown the dict
func (d *SimpleDict) Shutdown() {
	close(d.exitChan)
	d.wg.Wait()
}

func (d *SimpleDict) findIndex(id int32) (i int32, exist bool) {
	b, e := 0, len(d.words)-1
	for b <= e {
		m := (b + e) >> 1
		mid := d.words[m].ID
		switch {
		case mid == id:
			i, exist = int32(m), true
			return
		case mid < id:
			b = m + 1
		default:
			e = m - 1
		}
	}
	return
}

func (d *SimpleDict) markModified() {
	atomic.AddInt32(&d.state, 1)
}

func (d *SimpleDict) dump() {
	state := atomic.LoadInt32(&d.state)
	if state <= 0 {
		return
	}

	data, err := json.Marshal(d.words)
	if err != nil {
		d.logger.Printf("[ERROR] marshal data error:%s", err)
		return
	}

	err = ioutil.WriteFile(d.filename, data, os.ModePerm)
	d.logger.Printf("[INFO] write file %s error:%v", d.filename, err)

	atomic.AddInt32(&d.state, -state)
}

// NewSimpleDict creates dict using simplest style
func NewSimpleDict() *SimpleDict {
	return &SimpleDict{
		filename: "dict.json",
		exitChan: make(chan struct{}),
		logger:   log.New(os.Stderr, "[Simple Dict] ", log.LstdFlags),
	}
}
